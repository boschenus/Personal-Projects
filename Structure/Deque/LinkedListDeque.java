public class LinkedListDeque<any> {
    private class Node {
        Node prev;
        any item;
        Node next;

        public Node(Node p, any i, Node n) {
            prev = p;
            item = i;
            next = n;
        }
    }

    Node sentinel;
    int size;
    public LinkedListDeque(any i) {
        sentinel = new Node(null, null,null);
        sentinel.next = new Node(sentinel, i, sentinel);
        sentinel.prev = sentinel.next;
        size = 1;
    }

    public LinkedListDeque() {
        sentinel = new Node(null, null, null);
        sentinel.next = sentinel;
        sentinel.prev = sentinel;
        size = 0;
    }

    public LinkedListDeque(LinkedListDeque other) {
        sentinel = new Node(null, null, null);
        sentinel.next = sentinel;
        sentinel.prev = sentinel;
        size = 0;
        for (int i=0; i<other.size; i++) {
            addLast((any) other.get(i));
        }
    }

    public void addFirst(any item) {
        sentinel.next.prev = new Node(sentinel, item, sentinel.next);
        sentinel.next = sentinel.next.prev;
        size+=1;
    }

    public void addLast(any item) {
        sentinel.prev.next = new Node(sentinel.prev, item, sentinel);
        sentinel.prev = sentinel.prev.next;
        size+=1;
    }

    public boolean isEmpty() {
        return sentinel.prev == sentinel;
    }

    public int size() {
        return size;
    }

    public void printDeque() {
        for (int i = 0; i<size; i++) {
            Node p = sentinel.next;
            System.out.print(String.valueOf(p.item) + " ");
        }
    }

    public any removeFirst() {
        sentinel.next.next.prev = sentinel;
        any i = sentinel.next.item;
        sentinel.next = sentinel.next.next;
        if (size != 0) {
            size = size - 1;
        }
        return i;
    }

    public any removeLast() {
        sentinel.prev.prev.next = sentinel;
        any i = sentinel.prev.item;
        sentinel.prev = sentinel.prev.prev;
        if (size != 0) {
            size = size - 1;
        }
        return i;
    }

    public any get(int index) {
        if (index >= size) {
            throw new Error("Index is over the largest size");
        }
        Node p = sentinel.next;
        for (int i = 0; i<index; i++) {
            p = p.next;
        }
        return p.item;
    }

    private any getHelper(Node p, int i) {
        if (i == 0) {
            return p.item;
        }
        return getHelper(p.next, i-1);
    }
    public any getRecursive(int index) {
        if (index >= size) {
            throw new Error("Index is over the largest size");
        }

        return getHelper(sentinel.next, index);
    }


}
