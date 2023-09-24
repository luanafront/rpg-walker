type PositionXY = [number, number]
class Cell {
  public htmlElement: HTMLLIElement = document.createElement('li')

  constructor(public positionXY: PositionXY, public rowElement: HTMLElement) {
    this.positionXY = positionXY
    this.rowElement = rowElement
  }

  makeCellKey() {
    const [positionX, positionY] = this.positionXY
    return `cell-${positionX}-${positionY}`
  }
  render(onMoveEntity: (destinationXY: PositionXY) => void) {
    const cellClassName = 'cell'
    const cellId = this.makeCellKey()
    this.htmlElement.classList.add(cellClassName)
    this.htmlElement.id = cellId
    this.htmlElement.addEventListener('click', () => {
      onMoveEntity(this.positionXY)
    })
    this.rowElement.appendChild(this.htmlElement)
  }
  static getCell(cellX: number, cellY: number) {
    const cellId = `cell-${cellX}-${cellY}`
    return document.getElementById(cellId)
  }
}

class Row {
  public htmlElement: HTMLOListElement = document.createElement('ol')
  constructor(public fieldElement: HTMLElement, public cellAmount: number, public index: number) {
    this.fieldElement = fieldElement
    this.cellAmount = cellAmount
    this.index = index
  }
  private makeCells(){
    const cells:  Cell[] = []
    for(let i = 0; i < this.cellAmount; i++){
      const cellX = i
      const {index: cellY} = this
      const cell = new Cell([cellX, cellY], this.htmlElement)
      cells.push(cell)
    }
    return cells
  }

  render(onMoveEntity: (destinationXY: PositionXY) => void) {
    const rowClassName = 'row'
    this.htmlElement.classList.add(rowClassName)
    const cells = this.makeCells()
    for(const cell of cells) {
      cell.render(onMoveEntity)
    }
    this.fieldElement.appendChild(this.htmlElement)
  }
}

class Entity{
  private placesToMove = 1
  public onMove: (destinationXY: PositionXY) => void = (_destinationXY: PositionXY) => {}
  public htmlElement: HTMLDivElement = document.createElement('div')
  constructor(public positionXY: PositionXY) {
    this.positionXY = positionXY
  }

  move(destinationXY: PositionXY) {
    const moveInterval = setInterval(() => {
      const [destinationX, destinationY] = destinationXY
      const [entityX, entityY] = this.positionXY
      const arrivedX = destinationX === entityX
      const arrivedY = destinationY === entityY
      const arrived = arrivedX && arrivedY

      if(arrived) {
        clearInterval(moveInterval)
        return
      }

      this.goToNextPlace(arrivedX, entityX, destinationX, arrivedY, entityY, destinationY);

      this.onMove(this.positionXY)
    }, 600)
  }

  private goToNextPlace(arrivedX: boolean, entityX: number, destinationX: number, arrivedY: boolean, entityY: number, destinationY: number) {
    if (!arrivedX) {
      const needToMoveLeft = entityX > destinationX
      const moveLeft = entityX - this.placesToMove
      const moveRigth = entityX + this.placesToMove

      const newX = needToMoveLeft ? moveLeft : moveRigth
      this.setX(newX)
    } else if (!arrivedY) {
      const needToMoveTop = entityY > destinationY
      const moveTop = entityY - this.placesToMove
      const moveBottom = entityY + this.placesToMove

      const newY = needToMoveTop ? moveTop : moveBottom
      this.setY(newY)
    }
  }

  setX(x: number){
    const [_, oldY] = this.positionXY
    this.positionXY = [x, oldY]
  }
  setY(y: number){
    const [oldX, _] = this.positionXY
    this.positionXY = [oldX, y]
  }

  render() {
    const entityClassName = 'entity'
    this.htmlElement.classList.add(entityClassName)
  }
}


class Space {
  public rowsAmount = 9
  public columnAmount = 10
  public htmlElement: HTMLElement = document.createElement('section')
  constructor(public entity: Entity, public rootElement: HTMLElement) {
    this.entity = entity
    this.rootElement = rootElement
  }

  onMoveEntity(destinationXY: PositionXY) {
    const [cellX, cellY] = destinationXY
    const cell = Cell.getCell(cellX, cellY)
    cell.appendChild(this.entity.htmlElement)
  }

  makeRows() {
    const rows: Row[] = []
    for(let i = 0; i < this.rowsAmount; i++){
      const row = new Row(this.htmlElement, this.columnAmount, i)
      rows.push(row)
    }
    return rows
  }

  putEntity() {
    const [entityX, entityY] = this.entity.positionXY
    const cell = Cell.getCell(entityX, entityY)
    cell.appendChild(this.entity.htmlElement)
  }

  render() {
    const spaceClassName = 'space'
    this.htmlElement.classList.add(spaceClassName)
    this.entity.render()
    this.entity.onMove = this.onMoveEntity.bind(this)
    const rows = this.makeRows()
    for(const row of rows) {
      row.render(this.entity.move.bind(this.entity))
    }
    this.rootElement.appendChild(this.htmlElement)
    this.putEntity()
  }
}

const root = document.getElementById('root')
const luana = new Entity([0, 0])
const space = new Space(luana, root)

space.render()



