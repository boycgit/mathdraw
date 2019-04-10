// 参考：https://github.com/benoitvallon/computer-science-in-javascript/blob/master/data-structures-in-javascript/stack.es6.js
class Stack {
    constructor() {
      this.stack = [];
    }
  
    push(value) {
      this.stack.push(value);
    }
  
    pop() {
      return this.stack.pop();
    }
  
    peek() {
      return this.stack[this.stack.length - 1];
    }
  
    length() {
      return this.stack.length;
    }
  
    print() {
      console.log(this.stack.join(' '));
    }
  }

  export default Stack;