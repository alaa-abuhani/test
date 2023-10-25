// let eimpompNumber: string = "";
import leave from "../../PageObject/leaveTab";
let empNumber = "";
export default class employee {
  addEmloyeeViaAPI(
    firstName: string,
    middleName: string,
    lastName: string,
    empPicture: null,
    employeeId: string,
    password: string
  ) {
    cy.request({
      method: "POST",
      url: "/api/v2/pim/employees",
      body: {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        empPicture: empPicture,
        employeeId: employeeId,
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
          password: password,
          status: true,
          userRoleId: 2,
          empNumber: empNumber,
        },
      }).then((response) => {
        console.log(response, "user");
        // empNumber = response.body.data.empNumber;
        expect(response).property("status").to.equal(200);
        cy.log("empNumber user", empNumber);
        leave.leavePage();
        cy.visit(
          "https://opensource-demo.orangehrmlive.com/web/index.php/leave/addLeaveEntitlement"
        );
        cy.request({
          method: "POST",
          url: "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/leave-entitlements",
          body: {
            empNumber: empNumber,
            leaveTypeId: 7,
            fromDate: "2023-01-01",
            toDate: "2023-12-31",
            entitlement: "50",
          },
        }).then((res) => {
          console.log(res, "add entiltemnts ");
          cy.log("empNumber entitmnt", empNumber);
          cy.log("number", res.body.data.entitlement);
          // cy.logout();
        });

        // cy.wait(1000);
      });
    });
  }
}
