import { JasonSarahFrontendPage } from './app.po';

describe('jason-sarah-frontend App', () => {
  let page: JasonSarahFrontendPage;

  beforeEach(() => {
    page = new JasonSarahFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
