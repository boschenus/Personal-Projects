import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

public class HashMap<K, V> implements Map<K, V> {

    private static final int DEFAULT_SIZE = 16;
    private static final double MAX_LF = 0.75;

    private ArrayMap<K, V>[] buckets;
    private int size;

    private int loadFactor() {
        return size / buckets.length;
    }

    public HashMap() {
        buckets = new ArrayMap[DEFAULT_SIZE];
        this.clear();
    }
    public HashMap(int bucketNum) {
        buckets = new ArrayMap[bucketNum];
        this.clear();
    }
    /* Removes all of the mappings from this map. */
    @Override
    public void clear() {
        this.size = 0;
        for (int i = 0; i < this.buckets.length; i += 1) {
            this.buckets[i] = new ArrayMap<>();
        }
    }

    /** Computes the hash function of the given key. Consists of
     *  computing the hashcode, followed by modding by the number of buckets.
     *  To handle negative numbers properly, uses floorMod instead of %.
     */
    private int hash(K key) {
        if (key == null) {
            return 0;
        }

        int numBuckets = buckets.length;
        return Math.floorMod(key.hashCode(), numBuckets);
    }

    /* Returns the value to which the specified key is mapped, or null if this
     * map contains no mapping for the key.
     */
    @Override
    public V get(K key) {
        int hashCode = hash(key);
        return buckets[hashCode].get(key);
    }

    /** resize the HashMap */
    private void resize(int newSize) {
        HashMap<K, V> newHashMap = new HashMap<>(newSize);
        for (ArrayMap<K, V> bucket : buckets) {
            for (K key : bucket) {
                newHashMap.put(key, bucket.get(key));
            }
        }
        this.buckets = newHashMap.buckets;
        this.size = newHashMap.size;
    }

    /* Associates the specified value with the specified key in this map. */
    @Override
    public void put(K key, V value) {
        if (loadFactor() >= MAX_LF) {
            resize(size * 2);
        }
        int hashCode = hash(key);
        size -= buckets[hashCode].size;
        buckets[hashCode].put(key, value);
        size += buckets[hashCode].size;
    }

    /* Returns the number of key-value mappings in this map. */
    @Override
    public int size() {
        return size;
    }

    /* Returns a Set view of the keys contained in this map. */
    @Override
    public Set<K> keySet() {
        Set<K> keys = new HashSet<>();
        for (ArrayMap<K, V> bucket : buckets) {
            keys.addAll(bucket.keySet());
        }
        return keys;
    }

    @Override
    public V remove(K key) {
        int hashCode = hash(key);
        if (!buckets[hashCode].containsKey(key)) {
            return null;
        }
        size--;
        return buckets[hashCode].remove(key);
    }

    @Override
    public V remove(K key, V value) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Iterator<K> iterator() {
        return keySet().iterator();
    }
}
