import employee from "../../support/API/addEmpAPI/addEmpAPI";
import login from "../../support/PageObject/login";
import GenericHepler from "../../support/helpers/genericFunctions";

const loginObj: login = new login();
const empObj: employee = new employee();
let firstName = "";
let userId = "";

describe("add employee VIA API", () => {
  beforeEach(() => {
    cy.intercept("/web/index.php/dashboard/index").as("loginpage");
    cy.visit("https://opensource-demo.orangehrmlive.com");
    cy.fixture("login.json").as("logininfo");
    cy.fixture("employeeInfo").as("EmpInfo");
    cy.get("@logininfo").then((logininfo: any) => {
      loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
    });
    cy.get("@EmpInfo").then((EmpInfo: any) => {
      firstName = EmpInfo.user.firstName + GenericHepler.GenericRandomString();
      userId = EmpInfo.user.id + GenericHepler.GenericRandomString();
      empObj.addEmloyeeViaAPI(
        firstName,
        EmpInfo.user.middleName,
        EmpInfo.user.lastName,
        EmpInfo.user.empPicture,
        userId,
        EmpInfo.user.password
      );
    });
    // cy.visit("https://opensource-demo.orangehrmlive.com");
  });
  it(" LOGIN the user created via API ", () => {
    cy.get("@EmpInfo").then((EmpInfo: any) => {
      // cy.visit("https://opensource-demo.orangehrmlive.com");
      console.log(firstName, EmpInfo.user.password);
      // loginObj.loginValid(firstName, EmpInfo.user.password);
      // cy.visit(
      //   "https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave"
      // );
    });
  });
});
