import org.junit.Test;
import static org.junit.Assert.*;

public class TestPalindrome {
    // You must use this palindrome, and not instantiate
    // new Palindromes, or the autograder might be upset.
    static Palindrome palindrome = new Palindrome();

    @Test
    public void testWordToDeque() {
        Deque d = palindrome.wordToDeque("persiflage");
        String actual = "";
        for (int i = 0; i < "persiflage".length(); i++) {
            actual += d.removeFirst();
        }
        assertEquals("persiflage", actual);
    } // Uncomment this class once you've created your Palindrome class.

    @Test
    public void testIsPalindrome() {
        String word1 = "cat";
        String word2 = "noon";
        CharacterComparator cc = new OffByOne();
        assertFalse(palindrome.isPalindrome(word1));
        assertTrue(palindrome.isPalindrome(word2));
        assertFalse(palindrome.isPalindrome("aa", cc));
        assertTrue(palindrome.isPalindrome("baa", cc));
    }
}
