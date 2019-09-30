package com.mongodb.helper;

import org.objectweb.asm.ClassWriter;
import org.objectweb.asm.Opcodes;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Method;

/**
 * Created by liuxh on 2017/12/7.
 */
public class CreateClassUtil {

    public static String CLASS_NAME = "CreateClassTest";
    public static String CLASS_FILE = CLASS_NAME + ".java";

    public void createClass() {
        //生成一个类只需要ClassWriter组件即可
        ClassWriter cw = new ClassWriter(0);
        //通过visit方法确定类的头部信息
        cw.visit(Opcodes.V1_5, Opcodes.ACC_PUBLIC+Opcodes.ACC_ABSTRACT+Opcodes.ACC_INTERFACE,
                "com/asm3/Comparable", null, "java/lang/Object", new String[]{"com/asm3/Mesurable"});
        //定义类的属性
        cw.visitField(Opcodes.ACC_PUBLIC+Opcodes.ACC_FINAL+ Opcodes.ACC_STATIC,
                "LESS", "I", null, new Integer(-1)).visitEnd();
        cw.visitField(Opcodes.ACC_PUBLIC+Opcodes.ACC_FINAL+Opcodes.ACC_STATIC,
                "EQUAL", "I", null, new Integer(0)).visitEnd();
        cw.visitField(Opcodes.ACC_PUBLIC+Opcodes.ACC_FINAL+Opcodes.ACC_STATIC,
                "GREATER", "I", null, new Integer(1)).visitEnd();
        //定义类的方法
        cw.visitMethod(Opcodes.ACC_PUBLIC+Opcodes.ACC_ABSTRACT, "compareTo",
                "(java/lang/Object;)I", null, null).visitEnd();
        cw.visitEnd(); //使cw类已经完成
        //将cw转换成字节数组写到文件里面去
        byte[] data = cw.toByteArray();
        File file = new File("Comparable.class");
        try {
            FileOutputStream fout = new FileOutputStream(file);
            fout.write(data);
            fout.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void compileClass() {
        /*String filePath = new File(CreateClassUtil.class.getClassLoader()
                .getResource("").getFile()).getAbsolutePath();
        String[] source = { "-d", filePath, new String(CLASS_FILE) };*/

        JavaCompiler javac = ToolProvider.getSystemJavaCompiler()   ;
        int compilationResult = javac.run(null,null,null, "-g","-verbose",CLASS_FILE);

    }

    public void runClass() {
        try {
            Class params[] = {};
            Object paramsObj[] = {};
            Class testClass = Class.forName(CLASS_NAME);
            Object iClass = testClass.newInstance();
            Method thisMethod = testClass.getDeclaredMethod("println", params);
            thisMethod.invoke(iClass, paramsObj);

/*            File file = new File(CLASS_FILE); URLClassLoader classloader = (URLClassLoader) ClassLoader.getSystemClassLoader();
            Method add = URLClassLoader.class.getDeclaredMethod("addURL", new Class[]{URL.class});
            add.setAccessible(true);
            add.invoke(classloader, new Object[]{file.toURI().toURL()});
            Class c = classloader.loadClass("CreateClassTest");
            Object o = c.newInstance();
            Method m = c.getDeclaredMethod("println");
            m.invoke(o, null);*/

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
