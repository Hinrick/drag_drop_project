enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public numOfPeople: number,
    public status: ProjectStatus
  ) {}
}

interface ValidateInterface {
  value: string | number;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
}

type Listener = (items: Project[]) => void;

//Project State Management
class State {
  private listener: Listener[] = [];
  private projects: Project[] = [];
  private static instance: State;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new State();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listener.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);
    for (const listenerFn of this.listener) {
      listenerFn(this.projects.slice());
    }
  }
}

const state = State.getInstance();

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

//Component Base Class
class Component {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLElement;
  element: HTMLElement;
}

//Project List
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLElement;
  element: HTMLElement;
  assignedProject: Project[];

  constructor(private type: "active" | "finished") {
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.assignedProject = [];
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = `${this.type}-projects`;

    state.addListener((projects: Project[]) => {
      const relatedProjects = projects.filter((project) => {
        if (this.type === "active") {
          return project.status === ProjectStatus.Active;
        } else {
          return project.status === ProjectStatus.Finished;
        }
      });
      this.assignedProject = relatedProjects;
      this.renderProjectList();
    });

    this.attach();
    this.renderContent();
  }

  private renderProjectList() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const projectItem of this.assignedProject) {
      const listItem = document.createElement("li");
      listItem.textContent = projectItem.title;
      listEl?.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECT`;
  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
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
      state.addProject(title, des, people);
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
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
