package model;

import java.util.List;

/**
 * Created by roman vintonyak on 22.10.14.
 */
public interface DataProvider<E> {

    public void putData(E data) throws Exception;

    public List<E> getAllData() throws Exception;

    public void clearData() throws Exception;
}
