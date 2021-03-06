package model;

import java.util.List;

/**
 * Created by roman vintonyak on 22.10.14.
 */
public interface DataProvider<E> {

    //put new address into file
    //returns status of operation
    public String putData(E data);

    //return all data
    public List<E> getAllData();

    //clear all data
    public void clearData();

    //remove specific address from file
    public String removeData(E data);
}
