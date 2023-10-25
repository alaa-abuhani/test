import candidate from "../../support/PageObject/candidate";
import login from "../../support/PageObject/login";

const loginObj: login = new login();
const candidateObj: candidate = new candidate();

describe("candidate functionality ", () => {
  beforeEach(() => {
    cy.intercept("/web/index.php/dashboard/index").as("loginpage");
    cy.visit("https://opensource-demo.orangehrmlive.com");
    cy.fixture("login.json").as("logininfo");
    cy.fixture("candidateInfo.json").as("candidateInfo");
    cy.get("@logininfo").then((logininfo: any) => {
      loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
    });
  });
  it("candidate add attachment ", () => {
    cy.visit(
      "https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addCandidate"
    );
    const path = "cypress/fixtures/alaa.txt";
    cy.get("@candidateInfo").then((candidateInfo: any) => {
      candidateObj.addCandidate(
        candidateInfo.firstName,
        candidateInfo.middleName,
        candidateInfo.lastName
      );
      candidateObj.uploadAttament(path, candidateInfo.filename);
    });
  });
});
