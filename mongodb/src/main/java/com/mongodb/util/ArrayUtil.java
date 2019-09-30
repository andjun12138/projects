package com.mongodb.util;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class ArrayUtil {
    public ArrayUtil() {
    }

    public static <T> List<T> array2ArrayList(T[] ts) {
        if(ts == null) {
            return null;
        } else {
            ArrayList array = new ArrayList(ts.length);
            int i = 0;

            for(int len = ts.length; i < len; ++i) {
                array.add(ts[i]);
            }

            return array;
        }
    }

    public static <T> List<T> array2LinkedList(T[] ts) {
        if(ts == null) {
            return null;
        } else {
            LinkedList array = new LinkedList();
            int i = 0;

            for(int len = ts.length; i < len; ++i) {
                array.add(ts[i]);
            }

            return array;
        }
    }
}
