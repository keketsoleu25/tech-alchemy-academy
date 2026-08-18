export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type LessonQuiz = {
  lessonSlug: string;
  title: string;
  passPercent: number;
  xpReward: number;
  questions: QuizQuestion[];
};

const quizzes: Record<string, LessonQuiz> = {
  "big-o-basics": {
    lessonSlug: "big-o-basics",
    title: "Big O Checkpoint",
    passPercent: 67,
    xpReward: 50,
    questions: [
      {
        id: "growth",
        prompt: "A single loop visits every item in an array once. What is its typical time complexity?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 2,
        explanation: "The amount of work grows roughly in proportion to the number of items.",
      },
      {
        id: "nested",
        prompt: "Two full loops are nested over the same n-item collection. What growth should you check for first?",
        options: ["O(1)", "O(n)", "O(n²)", "O(2n)"],
        correctIndex: 2,
        explanation: "Each item can cause another full pass, producing roughly n × n work.",
      },
      {
        id: "constants",
        prompt: "Why does O(2n) simplify to O(n)?",
        options: ["Two is always ignored in code", "Big O focuses on growth rate", "Loops cannot be multiplied", "Memory replaces time"],
        correctIndex: 1,
        explanation: "Big O compares how work grows as input grows, so constant multipliers do not change the growth class.",
      },
    ],
  },
  "control-flow": {
    lessonSlug: "control-flow",
    title: "Control Flow Checkpoint",
    passPercent: 67,
    xpReward: 50,
    questions: [
      {
        id: "condition",
        prompt: "Which construct is best when an algorithm must choose between two behaviours?",
        options: ["A condition", "An import", "A comment", "A type alias"],
        correctIndex: 0,
        explanation: "Conditions such as if/else choose which path executes based on state.",
      },
      {
        id: "loop-progress",
        prompt: "What is essential for a loop that should eventually stop?",
        options: ["A global variable", "State that moves toward the exit condition", "A nested function", "An array"],
        correctIndex: 1,
        explanation: "Without progress toward the exit rule, a loop can continue indefinitely.",
      },
      {
        id: "trace",
        prompt: "What is the most useful way to debug a small loop by hand?",
        options: ["Rename every variable", "Trace state one iteration at a time", "Remove the condition", "Convert it to recursion immediately"],
        correctIndex: 1,
        explanation: "Tracing each state transition exposes where the algorithm stops matching your expectation.",
      },
    ],
  },
  "array-foundations": {
    lessonSlug: "array-foundations",
    title: "Array Foundations Checkpoint",
    passPercent: 67,
    xpReward: 60,
    questions: [
      {
        id: "index",
        prompt: "Accessing an array value at a known valid index is usually what complexity?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 0,
        explanation: "Arrays normally provide direct indexed access without scanning earlier elements.",
      },
      {
        id: "traversal",
        prompt: "Finding the largest value with one pass through an unsorted array is typically what time complexity?",
        options: ["O(1)", "O(n)", "O(n²)", "O(2ⁿ)"],
        correctIndex: 1,
        explanation: "Every value may need to be inspected once.",
      },
      {
        id: "front-insert",
        prompt: "Why can inserting at the beginning of an array be expensive?",
        options: ["The array becomes immutable", "Existing values may need to shift", "Indexes stop working", "The array must be sorted"],
        correctIndex: 1,
        explanation: "Contiguous indexed collections may need to move existing elements to make room at the front.",
      },
    ],
  },
  "two-pointer-technique": {
    lessonSlug: "two-pointer-technique",
    title: "Two Pointers Checkpoint",
    passPercent: 67,
    xpReward: 75,
    questions: [
      {
        id: "sorted",
        prompt: "Why is sorted input especially useful for the classic two-pointer pair-sum technique?",
        options: ["It makes JavaScript faster", "Pointer movement can safely eliminate impossible values", "It prevents duplicates", "It guarantees every target exists"],
        correctIndex: 1,
        explanation: "Ordering tells you whether moving left or right can move the sum toward the target.",
      },
      {
        id: "sum-small",
        prompt: "The current sum is smaller than the target in an ascending sorted array. Which pointer usually moves?",
        options: ["Left pointer rightward", "Right pointer leftward", "Both pointers outward", "Neither pointer"],
        correctIndex: 0,
        explanation: "Moving the left pointer rightward increases the smaller selected value.",
      },
      {
        id: "benefit",
        prompt: "On already sorted input, a two-pointer pair search commonly improves O(n²) brute force to what?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n³)"],
        correctIndex: 2,
        explanation: "Each pointer moves inward at most n positions in total.",
      },
    ],
  },
  "sliding-window": {
    lessonSlug: "sliding-window",
    title: "Sliding Window Checkpoint",
    passPercent: 67,
    xpReward: 75,
    questions: [
      {
        id: "reuse",
        prompt: "What is the main performance idea behind a fixed-size sliding window?",
        options: ["Sort every window", "Reuse the previous window's work", "Copy the whole array", "Use recursion for every item"],
        correctIndex: 1,
        explanation: "You update the window by removing what leaves and adding what enters instead of recalculating everything.",
      },
      {
        id: "outgoing",
        prompt: "When a sum window moves one position right, what should happen to the outgoing value?",
        options: ["Add it again", "Subtract its contribution", "Sort it", "Store it forever"],
        correctIndex: 1,
        explanation: "The old leftmost value no longer belongs to the new window.",
      },
      {
        id: "complexity",
        prompt: "A fixed-size sliding-window scan across n values is commonly what time complexity?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 2,
        explanation: "Each position is processed with constant-time updates during one traversal.",
      },
    ],
  },
  "stack-foundations": {
    lessonSlug: "stack-foundations",
    title: "Stack Foundations Checkpoint",
    passPercent: 67,
    xpReward: 60,
    questions: [
      {
        id: "lifo",
        prompt: "Which rule describes a stack?",
        options: ["First in, first out", "Last in, first out", "Smallest in, first out", "Random in, random out"],
        correctIndex: 1,
        explanation: "The most recently pushed unresolved item is the first one removed.",
      },
      {
        id: "peek",
        prompt: "What does peek usually do?",
        options: ["Remove the oldest item", "Inspect the top item without removing it", "Clear the stack", "Reverse the stack"],
        correctIndex: 1,
        explanation: "Peek lets an algorithm inspect the current top state while preserving it.",
      },
      {
        id: "use-case",
        prompt: "Which feature naturally fits a stack?",
        options: ["Undo history", "A first-come service queue", "Alphabetical sorting", "Database indexing"],
        correctIndex: 0,
        explanation: "Undo usually reverses the most recent action before older actions.",
      },
    ],
  },
};

export function getLessonQuiz(lessonSlug: string) {
  return quizzes[lessonSlug] ?? null;
}

export function getPublicQuiz(lessonSlug: string) {
  const quiz = getLessonQuiz(lessonSlug);
  if (!quiz) return null;

  return {
    lessonSlug: quiz.lessonSlug,
    title: quiz.title,
    passPercent: quiz.passPercent,
    xpReward: quiz.xpReward,
    questions: quiz.questions.map(({ id, prompt, options }) => ({ id, prompt, options })),
  };
}
