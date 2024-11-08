import java.util.HashMap;

public class Gaan {
    public static HashMap<Character, String> map = new HashMap<>();

    public static void main(String[] args) {
        map.put('w', "a");
        map.put('x', "b");
        map.put('u', "c");
        map.put('v', "d");
        map.put('o', "e");
        map.put('k', "f");
        map.put('h', "g");
        map.put('d', "h");
        map.put('e', "i");
        map.put('a', "j");
        map.put('m', "k");
        map.put('s', "l");
        map.put('c', "m");
        map.put('b', "n");
        map.put('g', "o");
        map.put('n', "p");
        map.put('i', "q");
        map.put('z', "r");
        map.put('t', "s");
        map.put('r', "t");
        map.put('l', "u");
        map.put('f', "v");
        map.put('p', "w");
        map.put('j', "x");
        map.put('y', "y");
        map.put('q', "z");

        String key = "qxeduez489qx";
        StringBuilder sb = new StringBuilder();

        for (char a : key.toCharArray()) {
            if (map.get(a) != null) {
                sb.append(map.get(a));
                continue;
            }
            sb.append(a);
        }

        System.out.println(sb.toString());

    }


}
