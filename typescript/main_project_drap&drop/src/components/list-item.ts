//list item class
import { Draggable } from "../models/drag-drop"
import { Project } from "../models/project"
import { Component } from "./base"
import { autoBind } from "../decorators/autobind"

export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project

  get persons(): string {
    if (this.project.people === 1) {
      return "1 person"
    }
    return `${this.project.people} people`
  }

  constructor(rootId: string, project: Project) {
    super("single-project", rootId, false, project.id)
    this.project = project

    this.configure()
    this.renderContent()
  }

  @autoBind
  dragStartHandler(e: DragEvent): void {
    e.dataTransfer!.setData("text/plain", this.project.id)
    e.dataTransfer!.effectAllowed = "move"
  }

  dragEndHandler(_: DragEvent): void {
    console.log("drag_end")
  }

  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler)
    this.element.addEventListener("dragend", this.dragEndHandler)
  }

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title
    this.element.querySelector("h3")!.textContent = this.persons + " assigned"
    this.element.querySelector("p")!.textContent = this.project.description
  }
}
