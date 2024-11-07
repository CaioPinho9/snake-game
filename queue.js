class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // Add an element to the end of the queue
  enqueue(element) {
    const newNode = new Node(element);
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  // Remove an element from the front of the queue
  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    const dequeuedValue = this.head.value;
    this.head = this.head.next;
    this.length--;
    if (this.isEmpty()) {
      this.tail = null;
    }
    return dequeuedValue;
  }

  // Check if the queue is empty
  isEmpty() {
    return this.length === 0;
  }

  // Get the front element of the queue without removing it
  peek() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.head.value;
  }

  // Get the last element of the queue without removing it
  peekBack() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.tail.value;
  }

  forEach(callback, thisArg) {
    let current = this.head;
    while (current) {
      callback.call(thisArg, current.value);
      current = current.next;
    }
  }
}

export default Queue;
