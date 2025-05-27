import { applyUpdate } from './editFileHandler';

describe('applyUpdate', () => {
  // Basic Edits
  it('should insert text at the beginning', () => {
    const fileContent = 'line 2\nline 3';
    const update = 'line 1\n{{ ... }}';
    const expected = 'line 1\nline 2\nline 3';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should insert text in the middle', () => {
    const fileContent = 'line 1\nline 3';
    const update = '{{ ... }}\nline 2\n{{ ... }}';
    const expected = 'line 1\nline 2\nline 3';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should insert text at the end', () => {
    const fileContent = 'line 1\nline 2';
    const update = '{{ ... }}\nline 3';
    const expected = 'line 1\nline 2\nline 3';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should delete text from the beginning', () => {
    const fileContent = 'line 1\nline 2\nline 3';
    const update = '{{ ... }}\nline 3'; // This implies line 1 and 2 are matched by {{...}} from updateLines, but line 3 is new
                                      // and original line 3 is deleted.
                                      // The strategy means we take lines from update. If placeholder, take original.
                                      // So, update has placeholder (takes original line1), then line 3 (takes update line3).
                                      // This actually means keep line1, replace line2 with line3.
                                      // Correct update to delete line1, line2:
    const updateToDelete = 'line 3'; // This means only line 3 remains.
    const expected = 'line 3';
    expect(applyUpdate(fileContent, updateToDelete)).toBe(expected);
  });

  it('should delete text from the middle', () => {
    const fileContent = 'line 1\nline 2\nline 3';
    const update = 'line 1\n{{ ... }}\nline 3'; // This is tricky. Placeholder means "preserve what's between line 1 and line 3 in original"
                                             // This means "line 1", then "line 2" (from placeholder), then "line 3"
                                             // This would result in the original string.
                                             // To delete line 2:
    const updateToDelete = 'line 1\nline 3';
    const expected = 'line 1\nline 3';
    expect(applyUpdate(fileContent, updateToDelete)).toBe(expected);
  });

  it('should delete text from the end', () => {
    const fileContent = 'line 1\nline 2\nline 3';
    const update = 'line 1'; // This means only line 1 remains.
    const expected = 'line 1';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should modify a line in the middle', () => {
    const fileContent = 'line A\nline B\nline C';
    const update = '{{ ... }}\nnew line B\n{{ ... }}';
    const expected = 'line A\nnew line B\nline C';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should replace the entire file content with new content', () => {
    const fileContent = 'old line 1\nold line 2';
    const update = 'new line 1\nnew line 2\nnew line 3';
    const expected = 'new line 1\nnew line 2\nnew line 3';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  // Placeholder Usage ({{ ... }})
  it('should handle a single placeholder at the start', () => {
    const fileContent = 'line 1\nline 2\nline 3';
    const update = '{{ ... }}\nline 3'; // placeholder matches line1, line2. update then specifies line3.
                                      // patienceDiff will see [line1, line2, line3] and [line1, line2, line3] (placeholder expanded)
                                      // then it takes update's line3.
                                      // This means "line1, line2, line3"
                                      // To test placeholder at start that actually *uses* placeholder logic:
    const updateToKeepEnd = '{{ ... }}\nline 2\nline 3'; // Keep line 2 and 3 from original using placeholder logic
    const expectedToKeepEnd = 'line 1\nline 2\nline 3'; // placeholder will match line 1
    expect(applyUpdate(fileContent, updateToKeepEnd)).toBe(expectedToKeepEnd);

    const updateToChangeStart = 'new first line\n{{ ... }}'; // placeholder matches line 2, line 3
    const expectedToChangeStart = 'new first line\nline 2\nline 3';
    expect(applyUpdate(fileContent, updateToChangeStart)).toBe(expectedToChangeStart);
  });

  it('should handle a single placeholder in the middle', () => {
    const fileContent = 'line 1\nline 2\nline 3\nline 4';
    const update = 'line 1\n{{ ... }}\nline 4'; // placeholder matches line 2, line 3
    const expected = 'line 1\nline 2\nline 3\nline 4';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle a single placeholder at the end', () => {
    const fileContent = 'line 1\nline 2\nline 3';
    const update = 'line 1\n{{ ... }}'; // placeholder matches line 2, line 3
    const expected = 'line 1\nline 2\nline 3';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle multiple placeholders', () => {
    const fileContent = 'section 1 line 1\nsection 1 line 2\nsection 2 line 1\nsection 2 line 2\nsection 3 line 1';
    const update = '{{ ... }}\nsection 2 line 1\nsection 2 line 2\n{{ ... }}\nsection 3 line 1';
    // placeholder 1 matches "section 1 line 1", "section 1 line 2"
    // then "section 2 line 1", "section 2 line 2" are from update (and match original)
    // placeholder 2 matches "section 3 line 1" (which is also specified, but placeholder takes precedence for original)
    // The logic is: if update line is placeholder, take original. Otherwise take update.
    // So: original s1l1, s1l2 (from placeholder1)
    //     update s2l1, s2l2 (actual lines)
    //     original s3l1 (from placeholder2)
    const expected = 'section 1 line 1\nsection 1 line 2\nsection 2 line 1\nsection 2 line 2\nsection 3 line 1';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle multiple placeholders with edits in between', () => {
    const fileContent = 'line A1\nline A2\nline B1\nline B2\nline C1\nline C2';
    const update = '{{ ... }}\nnew B1\nnew B2\n{{ ... }}';
    // placeholder 1 matches A1, A2
    // new B1, new B2 are from update
    // placeholder 2 matches C1, C2
    const expected = 'line A1\nline A2\nnew B1\nnew B2\nline C1\nline C2';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle placeholder representing no change (update is just {{ ... }})', () => {
    const fileContent = 'line 1\nline 2';
    const update = '{{ ... }}';
    const expected = 'line 1\nline 2';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle placeholder at the beginning and end of the update string', () => {
    const fileContent = 'line A\nline B\nline C\nline D';
    const update = '{{ ... }}\nline B\nline C\n{{ ... }}';
    // placeholder 1 matches line A
    // line B, line C are from update (match original)
    // placeholder 2 matches line D
    const expected = 'line A\nline B\nline C\nline D';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle modification between two placeholders', () => {
    const fileContent = 'first part\nmiddle part old\nlast part';
    const update = '{{ ... }}\nmiddle part new\n{{ ... }}';
    const expected = 'first part\nmiddle part new\nlast part';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle insertion between two placeholders', () => {
    const fileContent = 'first part\nlast part';
    const update = '{{ ... }}\ninserted middle part\n{{ ... }}';
    const expected = 'first part\ninserted middle part\nlast part';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle deletion of a block that was between two placeholders (placeholders come together)', () => {
    const fileContent = 'first part\ntext to delete\nlast part';
    const update = '{{ ... }}\n{{ ... }}'; // This is interpreted as: keep "first part", then keep "last part"
    const expected = 'first part\nlast part';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  // Mixed Edits
  it('should handle a combination of direct edits and placeholders', () => {
    const fileContent = 'line 1\nline 2\nline 3\nline 4\nline 5';
    const update = 'new line 1\n{{ ... }}\nnew line 3\n{{ ... }}\nnew line 5';
    // new line 1 (replaces line 1)
    // placeholder (keeps line 2)
    // new line 3 (replaces line 3)
    // placeholder (keeps line 4)
    // new line 5 (replaces line 5)
    const expected = 'new line 1\nline 2\nnew line 3\nline 4\nnew line 5';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle multiple disjoint edits separated by placeholders', () => {
    const fileContent = 'AA\nBB\nCC\nDD\nEE\nFF';
    const update = '{{ ... }}\nnew BB\n{{ ... }}\nnew EE\n{{ ... }}';
    // placeholder 1 -> AA
    // new BB -> replaces BB
    // placeholder 2 -> CC, DD
    // new EE -> replaces EE
    // placeholder 3 -> FF
    const expected = 'AA\nnew BB\nCC\nDD\nnew EE\nFF';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  // Edge Cases
  it('should handle empty fileContent with placeholder update (inserting placeholder text literally is not the behavior)', () => {
    const fileContent = '';
    const update = '{{ ... }}'; // Placeholder means "take original". Original is empty.
    const expected = '';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle empty fileContent with actual content update', () => {
    const fileContent = '';
    const update = 'new line 1\nnew line 2';
    const expected = 'new line 1\nnew line 2';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle empty update string (meaning delete all if no placeholders)', () => {
    const fileContent = 'line 1\nline 2';
    const update = '';
    const expected = ''; // All lines from original are not covered by update, so deleted.
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });
  
  it('should handle update string consisting only of {{ ... }} (same as placeholder representing no change)', () => {
    const fileContent = 'line 1\nline 2';
    const update = '{{ ... }}';
    const expected = 'line 1\nline 2';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle update string identical to fileContent', () => {
    const fileContent = 'line 1\nline 2';
    const update = 'line 1\nline 2';
    const expected = 'line 1\nline 2';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });
  
  it('should handle update string identical to fileContent, but with placeholders', () => {
    const fileContent = 'line 1\nline 2\nline 3';
    const update = 'line 1\n{{ ... }}\nline 3';
    const expected = 'line 1\nline 2\nline 3';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle update string that is entirely new content with no placeholders', () => {
    const fileContent = 'old line 1\nold line 2';
    const update = 'completely new line 1\ncompletely new line 2';
    const expected = 'completely new line 1\ncompletely new line 2';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle update string aims to delete everything (empty string)', () => {
    const fileContent = 'line 1\nline 2\nline 3';
    const update = '';
    const expected = '';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });
  
  it('should handle update string aims to delete everything (single placeholder not matching empty file)', () => {
    const fileContent = 'line 1'; // Non-empty file
    const update = '{{ ... }}'; // Placeholder will match 'line 1'
    const expected = 'line 1';
    expect(applyUpdate(fileContent, update)).toBe(expected);

    const fileContentEmpty = ''; // Empty file
    const updateEmptyPlaceholder = '{{ ... }}'; // Placeholder matches nothing
    const expectedEmpty = '';
    expect(applyUpdate(fileContentEmpty, updateEmptyPlaceholder)).toBe(expectedEmpty);
  });

  it('should handle line endings correctly (all \\n)', () => {
    const fileContent = 'line 1\r\nline 2\r\nline 3'; // Mixed in content, but applyUpdate normalizes
    const update = '{{ ... }}\nnew line 2\n{{ ... }}';
    const expected = 'line 1\nnew line 2\nline 3'; // Expected with \n
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle complex scenario with multiple changes', () => {
    const fileContent = 'header\nitem 1\nitem 2\nitem 3\nfooter\ncopyright';
    const update = '{{ ... }}\nitem 1 updated\nitem 2 new\n{{ ... }}\nnew footer\n{{ ... }}';
    // {{...}} -> header
    // item 1 updated -> replaces item 1
    // item 2 new -> replaces item 2 (item 3 is deleted as it's not in update)
    // {{...}} -> item 3 (this is tricky, patience diff might map this to the original item 3.
    // Let's re-evaluate based on "Final applyUpdate Strategy"
    // Original: [header, item 1, item 2, item 3, footer, copyright]
    // Update:   [{{...}}, item 1 updated, item 2 new, {{...}}, new footer, {{...}}]
    // Diff lines from patienceDiff (conceptual):
    // 1. Common: header (from original, due to {{...}} in update)
    // 2. Change: item 1 -> item 1 updated
    // 3. Change: item 2 -> item 2 new
    // 4. Common: item 3 (from original, due to {{...}} in update)
    // 5. Change: footer -> new footer
    // 6. Common: copyright (from original, due to {{...}} in update)
    // Expected output according to the strategy:
    // Line "header" (original, due to first `{{ ... }}`)
    // Line "item 1 updated" (update)
    // Line "item 2 new" (update)
    // Line "item 3" (original, due to second `{{ ... }}`)
    // Line "new footer" (update)
    // Line "copyright" (original, due to third `{{ ... }}`)
    const expected = 'header\nitem 1 updated\nitem 2 new\nitem 3\nnew footer\ncopyright';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle deletion of lines between existing lines kept by placeholders', () => {
    const fileContent = 'line A\nline B (to delete)\nline C';
    const update = '{{ ... }}\nline C'; // Placeholder matches line A. Then update specifies line C.
                                      // Patience diff: common "line A", delete "line B", common "line C".
                                      // Expected: Line A (from placeholder), Line C (from update line)
    const expected = 'line A\nline C';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should insert lines between existing lines kept by placeholders', () => {
    const fileContent = 'line A\nline C';
    const update = '{{ ... }}\nline B (inserted)\n{{ ... }}';
    // Placeholder 1: line A
    // line B (inserted)
    // Placeholder 2: line C
    const expected = 'line A\nline B (inserted)\nline C';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });

  it('should handle placeholder that matches no lines in original when file is not empty', () => {
    const fileContent = 'line 1';
    const update = 'new line A\n{{ ... }}\nnew line B';
    // This is tricky. patienceDiff(originalLines=["line 1"], updateLines=["new line A", "{{ ... }}", "new line B"])
    // The placeholder in updateLines is just a string.
    // Diff:
    // - "line 1" (original) vs "new line A" (update) -> Change
    // - (no original line) vs "{{ ... }}" (update) -> Insert
    // - (no original line) vs "new line B" (update) -> Insert
    // Result:
    // "new line A"
    // "{{ ... }}" (placeholder is preserved from update if it doesn't map to an original line via aIndex)
    // "new line B"
    // According to current applyUpdate logic:
    // item for "new line A": aIndex=-1, bIndex=0 (updateLines[0]) -> newContent.push("new line A")
    // item for "{{ ... }}": aIndex=-1, bIndex=1 (updateLines[1]) -> placeholder.test is true. item.aIndex is -1. So it's dropped.
    // item for "new line B": aIndex=-1, bIndex=2 (updateLines[2]) -> newContent.push("new line B")
    // item for "line 1" (original, deleted): aIndex=0, bIndex=-1 -> dropped.
    const expected = 'new line A\nnew line B';
    expect(applyUpdate(fileContent, update)).toBe(expected);
  });
  
  it('should correctly handle deletion when update reduces content significantly', () => {
    const fileContent = 'line 1\nline 2\nline 3\nline 4\nline 5';
    const update = '{{ ... }}\nline 3\n{{ ... }}';
    // Placeholder 1 -> line 1, line 2
    // line 3 -> from update (matches original line 3)
    // Placeholder 2 -> line 4, line 5
    const expected = 'line 1\nline 2\nline 3\nline 4\nline 5'; // This is if placeholders expand fully and line 3 is common
    expect(applyUpdate(fileContent, update)).toBe(expected);

    // To actually delete lines 2 and 4:
    const updateToDelete = 'line 1\nline 3\nline 5';
    const expectedToDelete = 'line 1\nline 3\nline 5';
    expect(applyUpdate(fileContent, updateToDelete)).toBe(expectedToDelete);
  });

});
