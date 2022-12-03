function autoBind(_t: any, _m: string, descriptor: PropertyDescriptor) {
  const originMethod = descriptor.value;
  const adjustedMethod: PropertyDescriptor = {
    get() {
      const BoundFun = originMethod.bind(this);
      return BoundFun;
    },
  };
  return adjustedMethod;
}

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

  private getUserInput(): [string, string, number] | undefined {
    const enteredTitle = this.titleInputEle.value;
    const enteredDescription = this.descriptionInputEle.value;
    const enteredPeople = this.peopleInputEle.value;

    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
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
