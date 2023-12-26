import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ArraySet<T> implements Iterable<T> {
    private T[] items;
    private int size;

    private class ArraySetIterator implements Iterator<T> {
        private int wizPos;
        public ArraySetIterator() {
            wizPos = 0;
        }
        @Override
        public T next() {
            T item = items[wizPos];
            wizPos++;
            return item;
        }
        @Override
        public boolean hasNext(){
            return wizPos < size;
        }
    }

    public static <G> ArraySet<G> of(G... stuff) {
        ArraySet<G> returnSet = new ArraySet<G>();
        for (G item: stuff) {
            returnSet.add(item);
        }
        return returnSet;
    }
    public Iterator<T> iterator() {
        return new ArraySetIterator();
    }

//    @Override
//    public String toString() {
//        StringBuilder returnSB = new StringBuilder("{");
//        for (T item: this) {
//            returnSB.append(item.toString());
//            returnSB.append(",");
//        }
//        returnSB.append("}");
//        return returnSB.toString();
//    }
    @Override
    public String toString() {
        List<String> lst = new ArrayList<>();
        for (T item: this) {
            lst.add(item.toString());
        }
        return "{" + String.join(",", lst) + "}";
    }
    public ArraySet() {
        items = (T[]) new Object[100];
        size = 0;
    }

    public boolean contains(T x) {
        for (int i = 0; i < size; i += 1) {
            if (items[i].equals(x)) {
                return true;
            }
        }
        return false;
    }

    /* Associates the specified value with the specified key in this map. */
    public void add(T x) {
        if (x == null) {
            throw new IllegalArgumentException("can't add null");
        }
        if (contains(x)) {
            return;
        }
        items[size] = x;
        size += 1;
    }

    /* Returns the number of key-value mappings in this map. */
    public int size() {
        return size;
    }

    @Override
    public boolean equals(Object other) {
        if (other == null) {
            return false;
        }
        if (other.getClass() != this.getClass()) {
            return false;
        }
        ArraySet<T> o = (ArraySet<T>) other;
        if (o.size() != this.size()) {
            return false;
        }

        for (T item: this) {
            if (!o.contains(item)) {
                return false;
            }
        }
        return true;
    }
    public static void main(String[] args) {
        ArraySet<Integer> aset = new ArraySet<>();
        aset.add(5);
        aset.add(23);
        aset.add(42);

        //iteration
        for (int i : aset) {
            System.out.println(i);
        }

        //toString
        System.out.println(aset);

        //equals
        ArraySet<Integer> aset2 = new ArraySet<>();
        aset2.add(5);
        aset2.add(23);
        aset2.add(42);

        System.out.println(aset.equals(aset2));
        System.out.println(aset.equals(null));
        System.out.println(aset.equals("fish"));
        System.out.println(aset.equals(aset));

        //of
        ArraySet<String> a = ArraySet.of("a","b","v");
        System.out.print(a);
    }
}

