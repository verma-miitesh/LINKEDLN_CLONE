import React, { useEffect } from 'react'
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { getAboutUser } from '@/config/redux/action/authAction';
import { reset } from '@/config/redux/reducer/authReducer';

function NavBarComponent() {

    const router = useRouter();

    const authState = useSelector((state) => state.auth)

    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !authState.profileFetched) {
            dispatch(getAboutUser({ token }));
        }
    }, []);

    console.log("profileFetched:", authState.profileFetched);
    console.log("authState.user:", authState.user);
    // console.log("authState.user.userId:", authState.user.userId);
    console.log("authState.user.userId.name:", authState.user?.userId?.name);


    return (
        <div className={styles.container}>
            <nav className={styles.navBar}>

                <h1 style={{ cursor: "pointer" }} onClick={() => {
                    router.push("/")
                }}>Pro Connect</h1>

                <div className={styles.navBarOptionContainer}>

                    {authState.profileFetched && <div>
                        <div style={{ display: "flex", gap: "1.2rem", color: "black" }}>
                            <p>Hey, {authState.user?.userId?.name || "Guest"}</p>
                            <p style={{ fontWeight: "bold", cursor: "pointer" }}>Profile</p>
                            <p onClick={()=>{
                                localStorage.removeItem("token")
                                router.push("/login")
                                dispatch(reset());
                            }
                         } style={{ fontWeight: "bold", cursor: "pointer" }}>Logout</p>
                        </div>
                    </div>}

                    {!authState.profileFetched && <div onClick={() => {
                        router.push("/login")
                    }} className={styles.buttonJoin}>
                        <p>Be a part</p>
                    </div>}


                </div>

            </nav>
        </div>
    )
}

export default NavBarComponent