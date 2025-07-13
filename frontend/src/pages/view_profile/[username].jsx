import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getConnectionsRequest, getMyConnectionsRequest, sendConnectionRequest } from '@/config/redux/action/authAction'
import { getAllPosts } from '@/config/redux/action/postAction';
import { store } from '@/config/redux/store';

function ViewProfilePage({ userProfile }) {

  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);


  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest({ token: localStorage.getItem("token") }));
    await dispatch(getMyConnectionsRequest({ token: localStorage.getItem("token") }));
  }


  useEffect(() => {
    getUsersPost();
  }, [])

  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username
    })
    setUserPosts(post);
  }, [postReducer.posts])

  // useEffect(() => {
  //   console.log(authState.connections, userProfile.userId._id)
  //   if (authState.connections.some(user => user.connectionId._id === userProfile.userId._id)) {
  //     setIsCurrentUserInConnection(true);
  //     if (authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true) {
  //       setIsConnectionNull(false)
  //     }
  //   }

  //   if (authState.connectionRequest.some(user => user.userId._id === userProfile.userId._id)) {
  //     setIsCurrentUserInConnection(true);
  //     if (authState.connectionRequest.find(user => user.userId._id === userProfile.userId._id).status_accepted === true) {
  //       setIsConnectionNull(false)
  //     }
  //   }

  // }, [authState.connections,authState.connectionRequest])
  useEffect(() => {
    const connections = authState.connections || [];
    const requests = authState.connectionRequest || [];

    if (connections.some(user => user.connectionId._id === userProfile.userId._id)) {
      setIsCurrentUserInConnection(true);
      if (connections.find(user => user.connectionId._id === userProfile.userId._id)?.status_accepted === true) {
        setIsConnectionNull(false);
      }
    }

    if (requests.some(user => user.userId._id === userProfile.userId._id)) {
      setIsCurrentUserInConnection(true);
      if (requests.find(user => user.userId._id === userProfile.userId._id)?.status_accepted === true) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections, authState.connectionRequest, userProfile.userId._id])



  const searchParamers = useSearchParams();

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt='backdrop' />
          </div>
          <div className={styles.profileContainer__details}>

            <div className={styles.profileContainer__flex}>

              <div style={{ flex: "0.8" }}>
                <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem" }}>
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>
                </div>


                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectedButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        const token = localStorage.getItem("token");
                        const result = await dispatch(sendConnectionRequest({ token, user_id: userProfile.userId._id }));

                        if (result?.payload?.message === "Request already sent!") {
                          alert("Request already sent");
                        } else {
                          // Manually set to Pending immediately
                          setIsCurrentUserInConnection(true);
                          setIsConnectionNull(true);
                        }

                        // Re-fetch updated connections
                        // await dispatch(getConnectionsRequest({ token }));
                        // await dispatch(getMyConnectionsRequest({ token }));
                      }}

                      className={styles.connectBtn}
                    >
                      Connect
                    </button>

                  )}

                  <div onClick={async () => {
                    const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                    window.open(`${BASE_URL}/${response.data.message}`, "_blank")
                  }} style={{ cursor: "pointer" }}>
                    <svg style={{ width: "1.2em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>

                  </div>

                </div>

                <div>
                  <p>{userProfile.bio}</p>
                </div>

              </div>
              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>

                      <div className={styles.card}>
                        <div className={styles.card__profileContainer}>
                          {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt='' /> : <div style={{ width: "3.4rem", height: "3.4rem" }}></div>}

                        </div>
                        <p>{post.body}</p>
                      </div>

                    </div>
                  )
                })}
              </div>

            </div>

          </div>

          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {
                userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>{work.company}-{work.position}</p>
                      <p>{work.years}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>

        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export async function getServerSideProps(context) {
  console.log(context.query.username)
  try {
    const request = await clientServer.get("/user/get_profile_based_on_username", {
      params: {
        username: context.query.username
      }
    });
    // const response = await response.data;
    // console.log(response);
    return { props: { userProfile: request.data.profile } }
  } catch (err) {
    console.error("Error fetching profile:", err.message);

    return {
      notFound: true,
    };
  }
};

export default ViewProfilePage;