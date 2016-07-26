import { AutomabotsPage } from './app.po';

describe('automabots App', function() {
  let page: AutomabotsPage;

  beforeEach(() => {
    page = new AutomabotsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
