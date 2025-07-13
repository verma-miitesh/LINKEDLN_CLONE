import { BASE_URL } from '@/config';
import { AcceptConnection, getConnectionsRequest, getMyConnectionsRequest } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./index.module.css"
import { useRouter } from 'next/router';

function MyConnectionPage() {

    const dispatch = useDispatch();
    const router = useRouter();

    const authState = useSelector((state) => state.auth);


    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            dispatch(getConnectionsRequest({ token }));
            dispatch(getMyConnectionsRequest({ token }));
        }
    }, [dispatch]);

    // Add debugging logs
    useEffect(() => {
        console.log("🔍 Connection Request Data:", authState.connectionRequest);
        console.log("🔍 Connections Data:", authState.connections);
    }, [authState.connectionRequest, authState.connections]);


    const pendingRequests = (authState.connectionRequest || []).filter(
        (connection) => connection.status_accepted === null
    );

    const acceptedReceived = (authState.connectionRequest || []).filter(
        (connection) => connection.status_accepted === true
    );

    const acceptedSent = (authState.connections || []).filter(
        (connection) => connection.status_accepted === true
    );

    const myNetwork = [...acceptedReceived, ...acceptedSent];
    const uniqueNetwork = Array.from(
        new Map(
            myNetwork.map((conn) => {
                const user = conn.userId || conn.connectionId;
                return [user._id, conn];
            })
        ).values()
    );

    // useEffect(() => {
    //     if (authState.connectionRequest.length != 0) {
    //         console.log(authState.connectionRequest)
    //     }
    // }, [authState.connectionRequest])


    return (
        <UserLayout>
            <DashboardLayout>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <h4>Pending Requests</h4>
                    {pendingRequests.length === 0 && <h1>No Pending Requests</h1>}
                    {pendingRequests.map((user, index) => (
                        <div onClick={() => {
                            router.push(`/view_profile/${user.userId.username}`);
                        }} className={styles.userCard} key={index}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-between" }}>
                                <div className={styles.profilePicture}>
                                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt='' />
                                </div>
                                <div className={styles.userInfo}>
                                    <h3>{user.userId.name}</h3>
                                    <p>{user.userId.username}</p>
                                </div>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    const token = localStorage.getItem("token");
                                    dispatch(AcceptConnection({
                                        connectionId: user._id,
                                        token: token,
                                        action: "accept"
                                    }));
                                }} className={styles.connectedButton}>Accept</button>
                            </div>
                        </div>
                    ))}

                    <h4>My Network</h4>
                    {uniqueNetwork.length === 0 && <h1>No Connections Yet</h1>}
                    {uniqueNetwork.map((conn, index) => {
                        const user = conn.userId || conn.connectionId;
                        return (
                            <div onClick={() => {
                                router.push(`/view_profile/${user.username}`);
                            }} className={styles.userCard} key={index}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", justifyContent: "space-between" }}>
                                    <div className={styles.profilePicture}>
                                        <img src={`${BASE_URL}/${user.profilePicture}`} alt='' />
                                    </div>
                                    <div className={styles.userInfo}>
                                        <h3>{user.name}</h3>
                                        <p>{user.username}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DashboardLayout>
        </UserLayout>
    )
}

export default MyConnectionPage