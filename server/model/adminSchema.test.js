test('the Schema has parameter email on it', () => {
    expect(Schema).toContain('email');
    expect(new Set(Schema)).toContain('email');
  });