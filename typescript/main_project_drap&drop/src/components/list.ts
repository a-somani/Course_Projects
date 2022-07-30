//list class
import { DragTarget } from "../models/drag-drop"
import { Project, ProjectStatus } from "../models/project"
import { Component } from "./base"
import { projectState } from "../state/state"
import { ProjectItem } from "./list-item"
import { autoBind } from "../decorators/autobind"

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[]

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`)
    this.assignedProjects = []

    this.configure()
    this.renderContent()
  }

  @autoBind
  dragOverHandler(e: DragEvent): void {
    if (e.dataTransfer && e.dataTransfer.types[0] === "text/plain") {
      e.preventDefault()
      const listEl = this.element.querySelector("ul")!
      listEl.classList.add("droppable")
    }
  }

  @autoBind
  dropHandler(e: DragEvent): void {
    const prjId = e.dataTransfer!.getData("text/plain")
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    )
  }

  @autoBind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector("ul")!
    listEl.classList.remove("droppable")
  }

  configure(): void {
    this.element.addEventListener("dragover", this.dragOverHandler)
    this.element.addEventListener("dragleave", this.dragLeaveHandler)
    this.element.addEventListener("drop", this.dropHandler)

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((item) => {
        if (this.type === "active") {
          return item.status === ProjectStatus.Active
        }
        return item.status === ProjectStatus.Finished
      })
      this.assignedProjects = relevantProjects
      this.renderProjects()
    })
  }

  renderContent(): void {
    const listId = `${this.type}-projects-list`
    this.element.querySelector("ul")!.id = listId
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS"
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement
    listEl.innerHTML = ""
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem)
    }
  }
}
