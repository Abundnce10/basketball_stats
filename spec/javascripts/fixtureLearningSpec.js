describe("Learning About Fixtures", function() {

  it("offers three crucial functions", function() {
    expect(readFixtures).toBeDefined();
    expect(setFixtures).toBeDefined();
    expect(loadFixtures).toBeDefined();
  });

  it("can load fixtures froma  file", function() {
    loadFixtures('fragment.html');
    expect( $('.fragment')).toExist();
  });

  it("can read fixtures without appending to DOM", function() {
    var fixture = readFixtures('fragment.html');
    expect(fixture).toContain('li');
    expect( $(fixture).find('li') ).toHaveText('Add some data.');
  });

  it("can also receive the fixture as a parameter", function() {
    setFixtures('<div class="sandbox">hello there</div>');
    expect( $('.sandbox') ).toExist();
  });

  it("offers a sandbox function for convenience", function() {
    expect(sandbox).toBeDefined();
    setFixtures( sandbox({ 'class': 'some_class'}) );
    expect( $('#sandbox')).toExist();
    expect( $('.some_class')).toExist();
    expect( $('#sandbox')).toHaveClass('some_class');
  });

});