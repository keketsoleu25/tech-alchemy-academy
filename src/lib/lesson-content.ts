export type LessonContent = {
  eyebrow: string;
  headline: string;
  intro: string;
  steps: { title: string; text: string }[];
  keyIdea: string;
  code?: string;
  checkpoint: string;
};

const lessonContent: Record<string, LessonContent> = {
  "big-o-basics": {
    eyebrow: "Complexity",
    headline: "Measure how an algorithm grows.",
    intro:
      "Big O describes how an algorithm's work changes as the input gets larger. It helps you compare solutions before performance becomes a production problem.",
    steps: [
      {
        title: "Ignore constants",
        text: "Big O focuses on growth. O(2n) simplifies to O(n) because both grow linearly.",
      },
      {
        title: "Find the dominant work",
        text: "When several operations exist, the fastest-growing term matters most for large inputs.",
      },
      {
        title: "Check time and space",
        text: "A solution can be fast but memory-heavy, so evaluate both execution time and extra storage.",
      },
    ],
    keyIdea:
      "One loop over n items is usually O(n). A loop inside another loop over the same n items is usually O(n²).",
    code: `function containsValue(numbers, target) {
  for (const number of numbers) {
    if (number === target) return true;
  }

  return false;
}

// One pass through the array: O(n) time.
// No growing extra structure: O(1) space.`,
    checkpoint:
      "If the input doubles, ask whether the work stays similar, doubles, or roughly quadruples.",
  },
  "control-flow": {
    eyebrow: "Programming Foundations",
    headline: "Make algorithms choose and repeat.",
    intro:
      "Control flow determines which statements run and how often they run. Conditions make decisions; loops repeat work until a rule says stop.",
    steps: [
      {
        title: "Choose with conditions",
        text: "Use if/else when an algorithm needs different behaviour for different states.",
      },
      {
        title: "Repeat with purpose",
        text: "Use a loop when the same operation must run across items or until a condition changes.",
      },
      {
        title: "Guarantee progress",
        text: "Every loop should move toward its exit condition to avoid accidental infinite loops.",
      },
    ],
    keyIdea:
      "Trace variables one iteration at a time. If you can explain how state changes, you can usually debug the algorithm.",
    code: `function countPositive(numbers) {
  let count = 0;

  for (const number of numbers) {
    if (number > 0) {
      count++;
    }
  }

  return count;
}`,
    checkpoint:
      "Before writing a loop, name its starting state, exit condition, and the change that moves it toward the exit.",
  },
  "array-foundations": {
    eyebrow: "Arrays & Strings",
    headline: "Master ordered collections.",
    intro:
      "Arrays store values in order and give direct access by index. Many interview and production algorithms begin with confident traversal and indexing.",
    steps: [
      {
        title: "Read by index",
        text: "Array indexes let you access a known position directly, usually in O(1) time.",
      },
      {
        title: "Traverse once",
        text: "A single pass is often enough for totals, searches, filtering, and state tracking.",
      },
      {
        title: "Know mutation costs",
        text: "Appending is usually cheap; inserting at the beginning may require shifting many elements.",
      },
    ],
    keyIdea:
      "When solving an array problem, first ask whether one pass plus a small amount of state can avoid nested loops.",
    code: `function findLargest(numbers) {
  if (numbers.length === 0) return null;

  let largest = numbers[0];

  for (let index = 1; index < numbers.length; index++) {
    if (numbers[index] > largest) {
      largest = numbers[index];
    }
  }

  return largest;
}`,
    checkpoint:
      "For every array algorithm, be able to explain what each index means and why it stays inside the array bounds.",
  },
  "two-pointer-technique": {
    eyebrow: "Arrays & Strings",
    headline: "Search smarter with two pointers.",
    intro:
      "Two pointers replace repeated pair checking with coordinated movement. On sorted data, each comparison can eliminate values that cannot be part of the answer.",
    steps: [
      {
        title: "Start at both ends",
        text: "Place one pointer at the smallest value and one at the largest value.",
      },
      {
        title: "Compare the result",
        text: "Use the current values to decide whether the left or right pointer should move.",
      },
      {
        title: "Eliminate impossible values",
        text: "Because the data is sorted, each pointer move safely removes candidates without checking every pair.",
      },
    ],
    keyIdea:
      "Two pointers often turn an O(n²) pair search into O(n) after sorting or when the input is already ordered.",
    code: `function findPair(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    if (sum === target) return [numbers[left], numbers[right]];
    if (sum < target) left++;
    else right--;
  }

  return null;
}`,
    checkpoint:
      "Only move a pointer when you can explain which values that move eliminates and why they cannot be correct.",
  },
  "sliding-window": {
    eyebrow: "Arrays & Strings",
    headline: "Reuse work with a sliding window.",
    intro:
      "Sliding windows track a continuous section of an array or string. Instead of recomputing each section from scratch, update the result as the window moves.",
    steps: [
      {
        title: "Build the first window",
        text: "Calculate the state for the first k items once.",
      },
      {
        title: "Remove what leaves",
        text: "When the window moves, subtract or undo the contribution of the outgoing item.",
      },
      {
        title: "Add what enters",
        text: "Include the new item and compare the updated window with the best result so far.",
      },
    ],
    keyIdea:
      "A fixed-size sliding window can reduce repeated O(k) calculations across n positions to a single O(n) traversal.",
    code: `function maxWindowSum(numbers, size) {
  if (size <= 0 || size > numbers.length) return null;

  let sum = numbers.slice(0, size).reduce((total, n) => total + n, 0);
  let best = sum;

  for (let right = size; right < numbers.length; right++) {
    sum += numbers[right] - numbers[right - size];
    best = Math.max(best, sum);
  }

  return best;
}`,
    checkpoint:
      "Define exactly what your window represents and which values enter and leave on every move.",
  },
  "stack-foundations": {
    eyebrow: "Stacks & Queues",
    headline: "Use last-in, first-out thinking.",
    intro:
      "A stack returns the most recently added item first. This simple rule powers undo history, expression parsing, navigation, and many depth-first algorithms.",
    steps: [
      {
        title: "Push",
        text: "Add a new value to the top of the stack.",
      },
      {
        title: "Peek",
        text: "Inspect the top value without removing it when the next decision depends on current state.",
      },
      {
        title: "Pop",
        text: "Remove and return the most recently added value.",
      },
    ],
    keyIdea:
      "Use a stack when the newest unresolved task should be handled before older unresolved tasks.",
    code: `function isBalanced(text) {
  const stack = [];

  for (const character of text) {
    if (character === "(") stack.push(character);
    if (character === ")" && !stack.pop()) return false;
  }

  return stack.length === 0;
}`,
    checkpoint:
      "When considering a stack, ask whether your problem needs to remember work in reverse order.",
  },
};

export function getLessonContent(slug: string, fallbackTitle: string, fallbackSummary: string): LessonContent {
  return (
    lessonContent[slug] ?? {
      eyebrow: "Academy Lesson",
      headline: fallbackTitle,
      intro: fallbackSummary,
      steps: [
        { title: "Understand", text: "Read the core idea and connect it to a problem you already know." },
        { title: "Trace", text: "Walk through a small example and track how the algorithm state changes." },
        { title: "Apply", text: "Implement the idea yourself and explain the time and space complexity." },
      ],
      keyIdea: fallbackSummary,
      checkpoint: "Explain the concept in your own words before marking the lesson complete.",
    }
  );
}
