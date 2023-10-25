import employee from "../../support/API/addEmpAPI/addEmpAPI";
import login from "../../support/PageObject/login";
import GenericHepler from "../../support/helpers/genericFunctions";

const loginObj: login = new login();
const empObj: employee = new employee();
let firstName = "alaa " + GenericHepler.GenericRandomString();
let userId = "100" + GenericHepler.GenericRandomString();
let empNumber = "";

describe("add employee VIA API", () => {
  beforeEach(() => {
    cy.intercept("/web/index.php/dashboard/index").as("loginpage");
    cy.visit("https://opensource-demo.orangehrmlive.com");
    cy.fixture("login.json").as("logininfo");
    cy.fixture("employeeInfo").as("EmpInfo");
    cy.get("@logininfo").then((logininfo: any) => {
      loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
      cy.request({
        method: "POST",
        url: "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-entitlements",
        body: {
          empNumber: 51,
          leaveTypeId: 8,
          fromDate: "2023-01-01",
          toDate: "2023-12-31",
          entitlement: "50",
        },
      })
        .then((res) => {
          console.log(res, "add entiltemnts ");

          cy.log("empNumber entitmnt", empNumber);
          cy.log("number", res.body.data.entitlement);
          // cy.get(".oxd-userdropdown-tab").click({ force: true });
          // cy.get(".oxd-dropdown-menu").contains("Logout").click({ force: true });
          // cy.logout();
          // cy.wait(30000);
        })
        .then((res) => {
          cy.get(".oxd-userdropdown-tab").click({ force: true });
          cy.get(".oxd-dropdown-menu")
            .contains("Logout")
            .click({ force: true });
          cy.visit("https://opensource-demo.orangehrmlive.com");
        });

      // cy.visit("https://opensource-demo.orangehrmlive.com");
    });
    //{
    // "firstName": "yaya14",
    // "middleName": "yaya",
    // "lastName": "yayay",
    // "empPicture": null,
    // "employeeId": "0260"
    // }

    // {
    //   "username": "yaya14",
    //   "password": "123456a",
    //   "status": true,
    //   "userRoleId": 2,
    //   "empNumber": 51
    // }
  });
  it(" LOGIN the user created via API ", () => {
    // cy.visit("https://opensource-demo.orangehrmlive.com");
    loginObj.loginValid("yaya14", "123456a");
    cy.request({
      method: "POST",
      url: "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-requests",
      body: {
        leaveTypeId: 8,
        fromDate: "2023-12-05",
        toDate: "2023-12-06",
        comment: null,
      },
    }).then((res) => {
      console.log(res, "userlogin request leave ");
      const id = res.body.data.id;
      cy.logout();
      cy.get("@logininfo").then((logininfo: any) => {
        loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);
        cy.request({
          method: "PUT",
          url: `https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/employees/leave-requests/${id}`,
          body: {
            action: "APPROVE",
          },
        }).then((response) => {
          expect(response).property("status").to.equal(200);
          cy.logout();
          cy.visit("https://opensource-demo.orangehrmlive.com");
          loginObj.loginValid("yaya14", "123456a");
          cy.visit(
            "https://opensource-demo.orangehrmlive.com/web/index.php/leave/viewMyLeaveList"
          );
        });
      });
    });
  });
});
Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});
