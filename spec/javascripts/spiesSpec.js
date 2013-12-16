describe("Learning about spies", function() {
  it("replaces the function it is spying on", function() {
    spyOn(myObj, 'someMethod').andCallFake(function() {
    	return 'hello there';
    });
    expect(myObj.someMethod()).toBe('hello there');
  });


/*
  it("makes async calls easier to work with", function() {
    spyOn($, 'ajax');

    setFixtures( sandbox() );

    $('#sandbox').asyncCall();

    $.ajax.mostRecentCall.args[0].success('<li>one</li><li>two</li>');

    expect( $('#sandbox').find('li').length ).toBe(2);

  });

*/  
});