//input class
import { Component } from "./base"
import { validate, ValidateInput } from "../util/validation"
import { autoBind } from "../decorators/autobind"
import { projectState } from "../state/state"

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputRoot: HTMLInputElement
  descriptionInputRoot: HTMLInputElement
  peopleInputRoot: HTMLInputElement

  constructor() {
    super("project-input", "app", true, "user-input")

    this.titleInputRoot = this.element.querySelector("#title")!
    this.descriptionInputRoot = this.element.querySelector("#description")!
    this.peopleInputRoot = this.element.querySelector("#people")!

    this.configure()
  }

  configure(): void {
    this.element.addEventListener("submit", this.handleSubmit)
  }
  renderContent(): void {}

  private validateInput(): [string, string, number] | void {
    const userTitle = this.titleInputRoot.value
    const userDescription = this.descriptionInputRoot.value
    const userPeople = +this.peopleInputRoot.value

    const titleTest: ValidateInput = {
      value: userTitle,
      required: true,
    }
    const descriptionTest: ValidateInput = {
      value: userDescription,
      required: true,
      minLength: 3,
    }
    const peopleTest: ValidateInput = {
      value: userPeople,
      required: true,
      minValue: 1,
      maxValue: 100,
    }
    console.log(titleTest)
    console.log(descriptionTest)
    console.log(peopleTest)

    if (
      validate(titleTest) &&
      validate(descriptionTest) &&
      validate(peopleTest)
    ) {
      return [userTitle, userDescription, userPeople]
    } else {
      alert("invalid input!")
      return
    }
  }

  @autoBind
  private handleSubmit(e: Event) {
    e.preventDefault()
    //console.log("submitted - " + this.titleInputRoot.value)
    const inputIsValid = this.validateInput()
    if (Array.isArray(inputIsValid)) {
      const [title, desc, people] = inputIsValid
      projectState.addProject(title, desc, people)
    }

    //reset fields after handled input
    this.titleInputRoot.value = ""
    this.descriptionInputRoot.value = ""
    this.peopleInputRoot.value = ""
  }
}
