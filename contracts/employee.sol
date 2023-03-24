//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EmployeeNew {
    struct Employee {
        string name;
        uint256 id;
        uint256 age;
    }
    mapping(uint256 => Employee) Employeedeets;
    Employee[] public emparr;

    constructor(string memory _name, uint256 _id, uint _age) {
        Employee memory e;
        e.name = _name;
        e.id = _id;
        e.age = _age;
        Employeedeets[_id] = e;
        emparr.push(e);
    }

    function addEmployee(string memory _name, uint256 _id, uint _age) public {
        Employee memory e;
        e.name = _name;
        e.id = _id;
        e.age = _age;
        Employeedeets[_id] = e;
        emparr.push(e);
    }

    function getById(uint256 _id) public view returns (string memory, uint256) {
        return (Employeedeets[_id].name, Employeedeets[_id].age);
    }

    function getAllEmployee() public view returns (Employee[] memory) {
        return emparr;
    }
}
