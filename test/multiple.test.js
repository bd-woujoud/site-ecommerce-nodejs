const {multiple}=require('./sum')
test('adds 5*6 to equal 30', () => {
    expect(multiple(5,6)).toBe(30);
  });