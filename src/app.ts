interface ValidateInterface {
  value: string | number;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
}

function autoBind(_t: any, _m: string, descriptor: PropertyDescriptor) {
  const originMethod = descriptor.value;
  const adjustedMethod: PropertyDescriptor = {
    get() {
      const boundFun = originMethod.bind(this);
      return boundFun;
    },
  };
  return adjustedMethod;
}

function validate(validateInput: ValidateInterface) {
  let isValid = true;
  if (validateInput.required) {
    isValid = isValid && validateInput.value.toString().trim().length !== 0;
  }

  if (
    validateInput.maxLength != null &&
    typeof validateInput.value === "string"
  ) {
    isValid = isValid && validateInput.maxLength >= validateInput.value.length;
  }

  if (
    validateInput.minLength != null &&
    typeof validateInput.value === "string"
  ) {
    isValid = isValid && validateInput.minLength <= validateInput.value.length;
  }

  if (validateInput.min != null && typeof validateInput.value === "number") {
    isValid = isValid && validateInput.min <= validateInput.value;
  }

  if (validateInput.max != null && typeof validateInput.value === "number") {
    isValid = isValid && validateInput.max >= validateInput.value;
  }

  return isValid;
}

//Project List
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLElement;
  element: HTMLElement;

  constructor() {}
}

//Project Inputs
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLElement;
  element: HTMLElement;
  titleInputEle: HTMLInputElement;
  descriptionInputEle: HTMLInputElement;
  peopleInputEle: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputEle = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputEle = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputEle = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private handleClearInput() {
    this.titleInputEle.value = "";
    this.descriptionInputEle.value = "";
    this.peopleInputEle.value = "";
  }

  private getUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEle.value;
    const enteredDescription = this.descriptionInputEle.value;
    const enteredPeople = this.peopleInputEle.value;

    const titleValidate: ValidateInterface = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidate: ValidateInterface = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidate: ValidateInterface = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidate) &&
      !validate(descriptionValidate) &&
      !validate(peopleValidate)
    ) {
      alert("Invalid inputs.");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  @autoBind
  private submitHandler(event: Event) {
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

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const project = new ProjectInput();
