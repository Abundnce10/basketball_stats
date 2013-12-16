describe("Experimentation", function() {
	var elem;

	beforeEach(function() {
	  elem = $('<div id="container" class="container"><p>Hello World</p></div>');
	});

  it("should know it exists", function() {
    expect(2).toEqual(2);
  });

  it("it allows us to search with CSS selectors", function() {
    expect(elem).toBe('#container');
    expect(elem).toContain('p');
  });

  it("detecs whether an element has a class", function() {
    expect(elem).toHaveClass('container');
  });

  it("detects whether an element has text", function() {
    expect(elem.children('p')).toHaveText('Hello World');
    expect(elem.children('p').text().match(/world/i)).toBeTruthy();
  });

  it("should detect if input has a value", function() {
    var input = $('<input value=myVal>');
    expect(input).toHaveValue('myVal');
  });

});