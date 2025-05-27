export type LinesValue = { count: number; index: number };
export type LinesMap = Map<string, LinesValue>;
export type UniqueValue = number;
export type UniqueMap = Map<string, UniqueValue>;
export type UniqueCommonValue = { aIndex: number; bIndex: number };
export type UniqueCommonMap = Map<string, UniqueCommonValue>;

export type UniqueCommonWithPrev = {
  aIndex: number;
  bIndex: number;
  prev?: UniqueCommonWithPrev;
};

export type Line = {
  line: string;
  aIndex: number;
  bIndex: number;
  type?: string;
  attributes?: { [key: string]: any };
  elementId?: number;
};
export type Lines = Line[];

export interface PatienceDiffResult {
  lines: Lines;
  lineCountDeleted: number;
  lineCountInserted: number;
}

const findUnique = (arr: string[], low: number, high: number): UniqueMap => {
  const lines: LinesMap = new Map<string, LinesValue>();
  for (let i = low; i <= high; i++) {
    const str = arr[i];
    if (lines.has(str)) {
      lines.get(str)!.count++;
      lines.get(str)!.index = i;
    } else lines.set(str, { count: 1, index: i });
  }

  const unique: UniqueMap = new Map<string, UniqueValue>();
  lines.forEach(({ count, index }, key) => {
    if (count === 1) unique.set(key, index);
  });

  return unique;
};

function findUniqueCommon(
  aArray: string[],
  aLow: number,
  aHigh: number,
  bArray: string[],
  bLow: number,
  bHigh: number
): UniqueCommonMap {
  const uniqueA = findUnique(aArray, aLow, aHigh);
  const uniqueB = findUnique(bArray, bLow, bHigh);
  const uniqueCommon: UniqueCommonMap = new Map<string, UniqueCommonValue>();

  uniqueA.forEach((_, key) => {
    if (uniqueB.has(key)) {
      uniqueCommon.set(key, {
        aIndex: uniqueA.get(key)!,
        bIndex: uniqueB.get(key)!,
      });
    }
  });

  return uniqueCommon;
}

const findLongestCommonSubsequence = (uniqueCommon: UniqueCommonMap) => {
  const jagged: UniqueCommonWithPrev[][] = [];
  uniqueCommon.forEach((val) => {
    let i = 0;
    const cur: UniqueCommonWithPrev = { ...val };
    while (jagged[i] && jagged[i][jagged[i].length - 1].bIndex < val.bIndex) {
      i++;
    }
    if (!jagged[i]) jagged[i] = [];
    if (i !== 0) cur.prev = jagged[i - 1][jagged[i - 1].length - 1];
    jagged[i].push(val);
  });

  let lcs: UniqueCommonWithPrev[] = [];
  if (jagged.length) {
    const lastArr = jagged[jagged.length - 1];
    const lastVal = lastArr[lastArr.length - 1];
    lcs = [lastVal];
    while (lcs[lcs.length - 1].prev) {
      lcs.push(lcs[lcs.length - 1].prev!);
    }
  }

  const final: UniqueCommonValue[] = lcs
    .reverse()
    .map(({ prev: _prev, ...val }) => ({ ...val }));
  return final;
};

const addToResult = (
  aLines: string[],
  aIndex: number,
  bLines: string[],
  bIndex: number,
  result: PatienceDiffResult
) => {
  if (bIndex === -1) result.lineCountDeleted++;
  else if (aIndex === -1) result.lineCountInserted++;
  const line = aIndex !== -1 ? aLines[aIndex] : bLines[bIndex];
  result.lines.push({ line, aIndex, bIndex });
};

function splitByLongestCommonSubsequence(
  aLines: string[],
  aLow: number,
  aHigh: number,
  bLines: string[],
  bLow: number,
  bHigh: number,
  givenUniqueCommon?: UniqueCommonMap
) {
  const sequence = findLongestCommonSubsequence(
    givenUniqueCommon ||
      findUniqueCommon(aLines, aLow, aHigh, bLines, bLow, bHigh)
  );

  const sections: {
    aLow: number;
    aHigh: number;
    bLow: number;
    bHigh: number;
  }[] = [];

  if (sequence.length === 0) {
    // Match entire string
    sections.push({ aLow, aHigh, bLow, bHigh });
  } else {
    // Match before first unique common string
    const { aIndex: aIndexFirst, bIndex: bIndexFirst } = sequence[0];
    if (aLow < aIndexFirst || bLow < bIndexFirst) {
      sections.push({
        aLow,
        aHigh: aIndexFirst - 1,
        bLow,
        bHigh: bIndexFirst - 1,
      });
    }

    // Match all but last unique common strings
    for (let i = 0; i < sequence.length - 1; i++) {
      sections.push({
        aLow: sequence[i].aIndex,
        aHigh: sequence[i + 1].aIndex - 1,
        bLow: sequence[i].bIndex,
        bHigh: sequence[i + 1].bIndex - 1,
      });
    }

    // Match last common string and beyond
    const length = sequence.length - 1;
    const { aIndex: aIndexLast, bIndex: bIndexLast } = sequence[length];
    if (aIndexLast <= aHigh || bIndexLast <= bHigh) {
      sections.push({
        aLow: aIndexLast,
        aHigh,
        bLow: bIndexLast,
        bHigh,
      });
    }
  }

  return sections;
}

const populatePatienceDiff = (
  aLines: string[],
  aLow: number,
  aHigh: number,
  bLines: string[],
  bLow: number,
  bHigh: number,
  result: PatienceDiffResult
) => {
  // Match lines at beginning and add to result
  while (aLow <= aHigh && bLow <= bHigh && aLines[aLow] === bLines[bLow]) {
    addToResult(aLines, aLow++, bLines, bLow++, result);
  }

  // Match lines at end for later addition to result
  const aHighTemp = aHigh;
  while (aLow <= aHigh && bLow <= bHigh && aLines[aHigh] === bLines[bHigh]) {
    aHigh--;
    bHigh--;
  }

  // Find unique common lines in center
  const uniqueCommon = findUniqueCommon(
    aLines,
    aLow,
    aHigh,
    bLines,
    bLow,
    bHigh
  );

  if (!uniqueCommon.size) {
    // Add lines in center to result if no matches found
    while (aLow <= aHigh) {
      addToResult(aLines, aLow++, bLines, -1, result);
    }
    while (bLow <= bHigh) {
      addToResult(aLines, -1, bLines, bLow++, result);
    }
  } else {
    // Recurse if matches found
    const sections = splitByLongestCommonSubsequence(
      aLines,
      aLow,
      aHigh,
      bLines,
      bLow,
      bHigh,
      uniqueCommon
    );
    sections.forEach(({ aLow, aHigh, bLow, bHigh }) =>
      populatePatienceDiff(aLines, aLow, aHigh, bLines, bLow, bHigh, result)
    );
  }

  // Add lines at end to result
  while (aHigh < aHighTemp) {
    addToResult(aLines, ++aHigh, bLines, ++bHigh, result);
  }
};

export const patienceDiff = (aLines: string[], bLines: string[]) => {
  const result: PatienceDiffResult = {
    lines: [],
    lineCountDeleted: 0,
    lineCountInserted: 0,
  };

  populatePatienceDiff(
    aLines,
    0,
    aLines.length - 1,
    bLines,
    0,
    bLines.length - 1,
    result
  );

  return result;
};
