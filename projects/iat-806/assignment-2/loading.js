// class for loading page

class LoadingPage extends Page {

    render() {
        background(0);
        push();

        rectMode(CENTER);
        textSize(100);
        text("Loading" + ".".repeat(frameCount % 30), width/2, height/2);

        pop();
    } 

}