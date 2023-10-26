import employee from "../../support/API/addEmpAPI/addEmpAPI";
import login from "../../support/PageObject/login";
import GenericHepler from "../../support/helpers/genericFunctions";
import leave from "../../support/PageObject/leaveTab";

const loginObj: login = new login();
const empObj: employee = new employee();
let firstName = "alaa " + GenericHepler.GenericRandomString();
let userId = "100" + GenericHepler.GenericRandomString();
let empNumber = "";

describe("add employee via API", () => {
  beforeEach(() => {
    cy.intercept("/web/index.php/dashboard/index").as("loginpage");
    cy.visit("https://opensource-demo.orangehrmlive.com");
    cy.fixture("login.json").as("logininfo");
    cy.fixture("employeeInfo.json").as("EmpInfo");

    cy.get("@logininfo").then((logininfo: any) => {
      loginObj.loginValid(logininfo[0].Username, logininfo[0].Password);

      //====

      // cy.fixture("@EmpInfo").then((EmpInfo: any) => {
      cy.request({
        method: "POST",
        url: "/api/v2/pim/employees",
        body: {
          firstName: firstName,
          // middleName: EmpInfo.user.middleName,
          middleName: "ghaleb",
          // lastName: EmpInfo.user.lastName,
          lastName: "abuhani",
          empPicture: null,
          employeeId: userId,
        },
      }).then((response) => {
        expect(response).property("status").to.equal(200);
        console.log(response, "emp");
        empNumber = response.body.data.empNumber;
        cy.log("empNumber in epm", empNumber);
        cy.request({
          method: "POST",
          url: "/api/v2/admin/users",
          body: {
            username: firstName,
            password: "123456a",
            status: true,
            userRoleId: 2,
            empNumber: empNumber,
          },
        }).then((response) => {
          console.log(response, "user");
          // empNumber = response.body.data.empNumber;
          expect(response).property("status").to.equal(200);
          cy.log("empNumber user", empNumber);
          // leave.leavePage();
          // cy.visit(
          //   "https://opensource-demo.orangehrmlive.com/web/index.php/leave/addLeaveEntitlement"
          // );
          cy.request({
            method: "POST",
            url: "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-entitlements",
            body: {
              empNumber: empNumber,
              leaveTypeId: 7,
              fromDate: "2023-01-01",
              toDate: "2023-12-31",
              entitlement: "100",
            },
          }).then((res) => {
            console.log(res, "add entiltemnts ");
            cy.log("empNumber entitmnt", empNumber);
            cy.log("number", res.body.data.entitlement);
            cy.logout();
          });

          // cy.wait(1000);
        });
      });

      //===

      // cy.request({
      //   method: "POST",
      //   url: "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-entitlements",
      //   body: {
      //     empNumber: empNumber,
      //     leaveTypeId: 8,
      //     fromDate: "2023-01-01",
      //     toDate: "2023-12-31",
      //     entitlement: "50",
      //   },
      // })
      // .then((res) => {
      //   console.log(res, "add entiltemnts ");

      //   cy.log("empNumber entitmnt", empNumber);
      //   cy.log("number", res.body.data.entitlement);
      //   // cy.get(".oxd-userdropdown-tab").click({ force: true });
      //   // cy.get(".oxd-dropdown-menu").contains("Logout").click({ force: true });
      //   // cy.logout();
      //   // cy.wait(30000);
      // })
      // .then((res) => {
      // cy.get(".oxd-userdropdown-tab").click({ force: true });
      // cy.get(".oxd-dropdown-menu").contains("Logout").click({ force: true });
      // cy.visit("https://opensource-demo.orangehrmlive.com");
      // });

      // cy.visit("https://opensource-demo.orangehrmlive.com");
      // });
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
  });
  it(" LOGIN the user created via API ", () => {
    // cy.visit("https://opensource-demo.orangehrmlive.com");
    loginObj.loginValid(firstName, "123456a");
    cy.request({
      method: "POST",
      url: "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-requests",
      body: {
        leaveTypeId: 7,
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
          loginObj.loginValid(firstName, "123456a");
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
