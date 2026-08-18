type ChallengeTestCase = {
  input: unknown[];
  expected: unknown;
};

type ChallengeRunInput = {
  code: string;
  functionName: string;
  testCases: ChallengeTestCase[];
};

export type ChallengeRunResult = {
  passed: boolean;
  passedTests: number;
  totalTests: number;
  runtimeMs: number | null;
  error: string | null;
};

type PistonResponse = {
  run?: {
    stdout?: string;
    stderr?: string;
    code?: number | null;
    signal?: string | null;
    wall_time?: number;
  };
  message?: string;
};

const RESULT_MARKER = "__TA_RESULT__";

function getRunnerConfig() {
  const baseUrl = process.env.CHALLENGE_RUNNER_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("CHALLENGE_RUNNER_NOT_CONFIGURED");
  }

  return {
    executeUrl: `${baseUrl}/api/v2/execute`,
    token: process.env.CHALLENGE_RUNNER_TOKEN,
  };
}

function buildHarness({ code, functionName, testCases }: ChallengeRunInput) {
  const serializedTests = JSON.stringify(testCases);
  const serializedFunctionName = JSON.stringify(functionName);

  return `
${code}

const __taTests = ${serializedTests};
const __taFunctionName = ${serializedFunctionName};
const __taCandidate =
  typeof globalThis[__taFunctionName] === "function"
    ? globalThis[__taFunctionName]
    : (typeof eval(__taFunctionName) === "function" ? eval(__taFunctionName) : null);

if (!__taCandidate) {
  console.log(${JSON.stringify(RESULT_MARKER)} + JSON.stringify({
    passed: false,
    passedTests: 0,
    totalTests: __taTests.length,
    error: "Expected function was not defined.",
  }));
  process.exit(0);
}

function __taEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

let __taPassed = 0;
let __taError = null;

for (const __taTest of __taTests) {
  try {
    const __taActual = __taCandidate(...__taTest.input);

    if (__taEqual(__taActual, __taTest.expected)) {
      __taPassed += 1;
    }
  } catch (error) {
    __taError = error instanceof Error ? error.message : "Solution threw an error.";
    break;
  }
}

console.log(${JSON.stringify(RESULT_MARKER)} + JSON.stringify({
  passed: __taPassed === __taTests.length,
  passedTests: __taPassed,
  totalTests: __taTests.length,
  error: __taError,
}));
`;
}

function parseRunnerResult(response: PistonResponse): ChallengeRunResult {
  const stdout = response.run?.stdout ?? "";
  const markerIndex = stdout.lastIndexOf(RESULT_MARKER);

  if (markerIndex === -1) {
    return {
      passed: false,
      passedTests: 0,
      totalTests: 0,
      runtimeMs: response.run?.wall_time ?? null,
      error:
        response.run?.stderr?.trim() ||
        response.message ||
        "The sandbox did not return a valid test result.",
    };
  }

  const rawResult = stdout.slice(markerIndex + RESULT_MARKER.length).trim().split("\n")[0];

  try {
    const parsed = JSON.parse(rawResult) as {
      passed?: boolean;
      passedTests?: number;
      totalTests?: number;
      error?: string | null;
    };

    return {
      passed: Boolean(parsed.passed),
      passedTests: parsed.passedTests ?? 0,
      totalTests: parsed.totalTests ?? 0,
      runtimeMs: response.run?.wall_time ?? null,
      error: parsed.error ?? null,
    };
  } catch {
    return {
      passed: false,
      passedTests: 0,
      totalTests: 0,
      runtimeMs: response.run?.wall_time ?? null,
      error: "The sandbox returned malformed test output.",
    };
  }
}

export async function runChallenge(input: ChallengeRunInput): Promise<ChallengeRunResult> {
  const { executeUrl, token } = getRunnerConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(executeUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        language: "javascript",
        version: "*",
        files: [
          {
            name: "main.js",
            content: buildHarness(input),
          },
        ],
        run_timeout: 3000,
        run_memory_limit: 128000000,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`CHALLENGE_RUNNER_HTTP_${response.status}`);
    }

    return parseRunnerResult((await response.json()) as PistonResponse);
  } finally {
    clearTimeout(timeout);
  }
}
