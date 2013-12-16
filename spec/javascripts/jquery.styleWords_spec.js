describe("jQuery.styleWords", function() {
	var frag;
	beforeEach(function() {
	  frag = $( readFixtures('fragment2.html') );
	});

  it("should be available on the jQUery object", function() {
    expect($.fn.styleWords).toBeDefined();
  });

/*
  it("should be chainable", function() {
    expect( frag.styleWords() ).toBe(frag);
  });

  it("should wrap a specified number of words in an html <span> tag", function() {
    frag.styleWords();
    expect(frag.find('<span').length).toBe(1);
  });
*/
});