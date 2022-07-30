//component base class
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateRoot: HTMLTemplateElement
  appRoot: T
  element: U

  constructor(
    templateId: string,
    appRootId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateRoot = document.getElementById(
      templateId
    )! as HTMLTemplateElement

    //get app in index.html
    this.appRoot = document.getElementById(appRootId)! as T

    //get content inside the template in index.html
    this.element = document.importNode(this.templateRoot.content, true)
      .firstElementChild as U
    //add id tag to html element to trigger related CSS in app.css
    if (newElementId) {
      this.element.id = newElementId
    }

    this.render(insertAtStart)
  }

  private render(position: boolean) {
    //render the form in the app in index.html
    this.appRoot.insertAdjacentElement(
      position ? "afterbegin" : "beforeend",
      this.element
    )
  }

  abstract configure(): void
  abstract renderContent(): void
}
