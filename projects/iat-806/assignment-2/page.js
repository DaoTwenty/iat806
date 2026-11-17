// generic class for a page, usually each associated to a game state

class Page {

    constructor(engine) {
        // engine is passed to retrieve data needed to render the page
        this.engine = engine;
    }

    // default methods to override

    enter() {}

    render() {} 

    mousePressed() {}

}