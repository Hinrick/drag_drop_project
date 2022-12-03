"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function autoBind(_t, _m, descriptor) {
    const originMethod = descriptor.value;
    const adjustedMethod = {
        get() {
            const BoundFun = originMethod.bind(this);
            return BoundFun;
        },
    };
    return adjustedMethod;
}
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        this.titleInputEle = this.element.querySelector("#title");
        this.descriptionInputEle = this.element.querySelector("#description");
        this.peopleInputEle = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    handleClearInput() {
        this.titleInputEle.value = "";
        this.descriptionInputEle.value = "";
        this.peopleInputEle.value = "";
    }
    getUserInput() {
        const enteredTitle = this.titleInputEle.value;
        const enteredDescription = this.descriptionInputEle.value;
        const enteredPeople = this.peopleInputEle.value;
        if (enteredTitle.trim().length === 0 ||
            enteredDescription.trim().length === 0 ||
            enteredPeople.trim().length === 0) {
            alert("Invalid inputs.");
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.getUserInput();
        if (Array.isArray(userInput)) {
            const [title, des, people] = userInput;
            console.log(title);
            console.log(des);
            console.log(people);
            this.handleClearInput();
        }
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}
__decorate([
    autoBind
], ProjectInput.prototype, "submitHandler", null);
const project = new ProjectInput();
