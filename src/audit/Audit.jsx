
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '_store';

export { Audit };

function Audit() {
    const users = useSelector(x => x.users.list);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userActions.getAll());
    }, []);

    const [is12HourFormat, setIs12HourFormat] = useState(true);
    const toggleFormat = () => {
        setIs12HourFormat(prevFormat => !prevFormat);
    };
    let data = users ? users : [];

    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data?.value ? data.value.filter(item => {
        const first_name = `${item.firstName}`;
        return first_name.toLowerCase().includes(searchTerm.toLowerCase());
    }) : '';
    console.log(filteredData, 'filterdata')
    const [sortBy, setSortBy] = useState(null);
    const sortedData = filteredData.length? filteredData.slice().sort((a, b) => {
        if (sortBy === 'first_name') {
          return a.firstName.localeCompare(b.firstName);
        } else if (sortBy === 'last_name') {
          return a.lastName.localeCompare(b.lastName);
        } else if (sortBy === 'user_name') {
          return a.username.localeCompare(b.username);
        } else if (sortBy === 'date') {
          return a.createdDate.localeCompare(b.createdDate);
        }
        return 0;
      }):"";
    
      const handleSort = column => {
        if (sortBy === column) {
          setSortBy(null);
        } else {
          setSortBy(column);
        }
      };
    return (
        <div>
            <h1>Auditor Page</h1>
            <button onClick={toggleFormat}>
                Toggle Format: {is12HourFormat ? '12-hour' : '24-hour'}
            </button>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}

            />
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('first_name')} style={{ width: '25%' }}>First Name</th>
                        <th onClick={() => handleSort('last_name')}style={{ width: '25%' }}>Last Name</th>
                        <th onClick={() => handleSort('user_name')}style={{ width: '25%' }}>Username</th>
                        <th onClick={() => handleSort('date')}style={{ width: '25%' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sortedData?.length === 0 ?
                            (
                                <tr>
                                    <td colSpan="4">No matching data found</td>
                                </tr>
                            ) :
                            sortedData?.map(user =>
                                <tr key={user.id}>
                                    <td >{user.firstName}</td>
                                    <td >{user.lastName}</td>
                                    <td >{user.username}</td>
                                    <td >
                                        {is12HourFormat
                                            ? new Date(user.createdDate).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                second: 'numeric',
                                                hour12: true,
                                            })
                                            : new Date(user.createdDate).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'numeric',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                second: 'numeric',
                                                hour12: false,
                                            })}
                                    </td>
                                </tr>
                            )}
                    {users?.loading &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}
