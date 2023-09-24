class Cell {
    constructor(positionXY, rowElement) {
        this.positionXY = positionXY;
        this.rowElement = rowElement;
        this.htmlElement = document.createElement('li');
        this.positionXY = positionXY;
        this.rowElement = rowElement;
    }
    makeCellKey() {
        const [positionX, positionY] = this.positionXY;
        return `cell-${positionX}-${positionY}`;
    }
    render(onMoveEntity) {
        const cellClassName = 'cell';
        const cellId = this.makeCellKey();
        this.htmlElement.classList.add(cellClassName);
        this.htmlElement.id = cellId;
        this.htmlElement.addEventListener('click', () => {
            onMoveEntity(this.positionXY);
        });
        this.rowElement.appendChild(this.htmlElement);
    }
    static getCell(cellX, cellY) {
        const cellId = `cell-${cellX}-${cellY}`;
        return document.getElementById(cellId);
    }
}
class Row {
    constructor(fieldElement, cellAmount, index) {
        this.fieldElement = fieldElement;
        this.cellAmount = cellAmount;
        this.index = index;
        this.htmlElement = document.createElement('ol');
        this.fieldElement = fieldElement;
        this.cellAmount = cellAmount;
        this.index = index;
    }
    makeCells() {
        const cells = [];
        for (let i = 0; i < this.cellAmount; i++) {
            const cellX = i;
            const { index: cellY } = this;
            const cell = new Cell([cellX, cellY], this.htmlElement);
            cells.push(cell);
        }
        return cells;
    }
    render(onMoveEntity) {
        const rowClassName = 'row';
        this.htmlElement.classList.add(rowClassName);
        const cells = this.makeCells();
        for (const cell of cells) {
            cell.render(onMoveEntity);
        }
        this.fieldElement.appendChild(this.htmlElement);
    }
}
class Entity {
    constructor(positionXY) {
        this.positionXY = positionXY;
        this.placesToMove = 1;
        this.onMove = (_destinationXY) => { };
        this.htmlElement = document.createElement('div');
        this.positionXY = positionXY;
    }
    move(destinationXY) {
        const moveInterval = setInterval(() => {
            const [destinationX, destinationY] = destinationXY;
            const [entityX, entityY] = this.positionXY;
            const arrivedX = destinationX === entityX;
            const arrivedY = destinationY === entityY;
            const arrived = arrivedX && arrivedY;
            if (arrived) {
                clearInterval(moveInterval);
                return;
            }
            if (!arrivedX) {
                const needToMoveLeft = entityX > destinationX;
                const moveLeft = entityX - this.placesToMove;
                const moveRigth = entityX + this.placesToMove;
                const newX = needToMoveLeft ? moveLeft : moveRigth;
                this.setX(newX);
            }
            else if (!arrivedY) {
                const needToMoveTop = entityY > destinationY;
                const moveTop = entityY - this.placesToMove;
                const moveBottom = entityY + this.placesToMove;
                const newY = needToMoveTop ? moveTop : moveBottom;
                this.setY(newY);
            }
            this.onMove(this.positionXY);
        }, 600);
    }
    setX(x) {
        const [_, oldY] = this.positionXY;
        this.positionXY = [x, oldY];
    }
    setY(y) {
        const [oldX, _] = this.positionXY;
        this.positionXY = [oldX, y];
    }
    render() {
        const entityClassName = 'entity';
        this.htmlElement.classList.add(entityClassName);
    }
}
class Space {
    constructor(entity, rootElement) {
        this.entity = entity;
        this.rootElement = rootElement;
        this.rowsAmount = 9;
        this.columnAmount = 10;
        this.htmlElement = document.createElement('section');
        this.entity = entity;
        this.rootElement = rootElement;
    }
    onMoveEntity(destinationXY) {
        const [cellX, cellY] = destinationXY;
        const cell = Cell.getCell(cellX, cellY);
        cell.appendChild(this.entity.htmlElement);
    }
    makeRows() {
        const rows = [];
        for (let i = 0; i < this.rowsAmount; i++) {
            const row = new Row(this.htmlElement, this.columnAmount, i);
            rows.push(row);
        }
        return rows;
    }
    putEntity() {
        const [entityX, entityY] = this.entity.positionXY;
        const cell = Cell.getCell(entityX, entityY);
        cell.appendChild(this.entity.htmlElement);
    }
    render() {
        const spaceClassName = 'space';
        this.htmlElement.classList.add(spaceClassName);
        this.entity.render();
        this.entity.onMove = this.onMoveEntity.bind(this);
        const rows = this.makeRows();
        for (const row of rows) {
            row.render(this.entity.move.bind(this.entity));
        }
        this.rootElement.appendChild(this.htmlElement);
        this.putEntity();
    }
}
const root = document.getElementById('root');
const luana = new Entity([0, 0]);
const space = new Space(luana, root);
space.render();
