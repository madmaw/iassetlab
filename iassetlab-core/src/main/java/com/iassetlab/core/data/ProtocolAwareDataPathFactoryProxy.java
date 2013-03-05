package com.iassetlab.core.data;

import com.iassetlab.core.DataPath;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: chris
 * Date: 5/03/13
 * Time: 6:58 PM
 * To change this template use File | Settings | File Templates.
 */
public class ProtocolAwareDataPathFactoryProxy implements DataPathFactory {

    private Map<String, DataPathFactory> protocolsToDataPathFactories;
    private String defaultProtocol;

    public ProtocolAwareDataPathFactoryProxy(Map<String, DataPathFactory> protocolsToDataPathFactories, String defaultProtocol) {
        this.protocolsToDataPathFactories = protocolsToDataPathFactories;
        this.defaultProtocol = defaultProtocol;
    }

    @Override
    public DataPath getDataPath(String absolutePath) {
        int consIndex = absolutePath.indexOf(':');
        String protocol;
        String path;
        if( consIndex >= 0 ) {
            protocol = absolutePath.substring(0, consIndex);
            path = absolutePath.substring(consIndex+1);
        } else {
            protocol = this.defaultProtocol;
            path = absolutePath;
        }
        DataPathFactory dataPathFactory = this.protocolsToDataPathFactories.get(protocol);
        if( dataPathFactory == null ) {
            throw new RuntimeException("unrecognised protocol "+protocol);
        }
        DataPath proxied = dataPathFactory.getDataPath(path);
        return new ProtocolAwareDataPathProxy(proxied, this, protocol);
    }
}
