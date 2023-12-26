public class Palindrome {
    public Deque<Character> wordToDeque(String word) {
        Deque<Character> c = new ArrayDeque<Character>();
        for (int i = 0; i < word.length(); i++) {
            c.addLast(word.charAt(i));
        }
        return c;
    }

    private boolean isPdHelper(String word, int start) {
        Deque<Character> c = wordToDeque(word);
        if (c.size() - 2 * start == 0) {
            return true;
        } else if (c.size() - 2 * start == 1) {
            return true;
        }

        if (word.charAt(start) == word.charAt(word.length() - (start + 1))) {
            return isPdHelper(word, start + 1);
        }
        return false;
    }
    public boolean isPalindrome(String word) {
        return isPdHelper(word, 0);
    }

    private boolean isPdHelper(String word, int start, CharacterComparator cc) {
        Deque<Character> c = wordToDeque(word);
        if (c.size() - 2 * start == 0) {
            return true;
        } else if (c.size() - 2 * start == 1) {
            return true;
        }

        if (cc.equalChars(word.charAt(start), word.charAt(word.length() - (start + 1)))) {
            return isPdHelper(word, start + 1, cc);
        }
        return false;
    }
    public boolean isPalindrome(String word, CharacterComparator cc) {
        return isPdHelper(word, 0, cc);
    }
}
