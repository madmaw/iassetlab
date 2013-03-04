package com.iassetlab.core.data;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 1/03/13
 * Time: 10:30 AM
 * To change this template use File | Settings | File Templates.
 */
public class ResourceDataPathFactory implements DataPathFactory {

    private ClassLoader classLoader;

    public ResourceDataPathFactory(ClassLoader classLoader) {
        this.classLoader = classLoader;
    }

    @Override
    public DataPath getDataPath(String uri) {
        return new ResourceDataPath(this.classLoader, uri);
    }
}
