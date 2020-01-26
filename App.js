import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Image,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    TextInput,
} from "react-native";

import * as api from "./src/api";

import moment from "moment";

const uuid = require("uuid/v1");

const Post = props => {
    return (
        <View style={styles.postContainer}>
            <View style={styles.postTop}>
                <View style={styles.postImageContainer}>
                    <Image />
                </View>
                <View style={styles.postNameContainer}>
                    <Text>{props.user.name}</Text>
                </View>
            </View>
            <View style={styles.postBottom}>
                <Text>{props.title}</Text>
            </View>
        </View>
    );
};

const NewPostModal = props => {
    let [title, setTitle] = useState("");
    let [body, setBody] = useState("");
    let [username, setUsername] = useState("");

    return (
        <>
            <Modal visible={props.visible} transparent>
                <View style={styles.postModal}>
                    <View style={styles.postModalContent}>
                        <TouchableOpacity style={styles.postModalCloseBtn} onPress={() => props.onClose()}>
                            <Text>X</Text>
                        </TouchableOpacity>
                        <Text style={[styles.postModalText, { fontSize: 30 }]}>New Post</Text>
                        <View style={styles.question}>
                            <Text style={styles.postModalText}>Title</Text>
                            <TextInput
                                value={title}
                                style={styles.input}
                                onChangeText={text => setTitle(text)}
                            />
                        </View>
                        <View style={styles.question}>
                            <Text style={styles.postModalText}>Body</Text>
                            <TextInput
                                style={[styles.input, { height: 100 }]}
                                multiline
                                onChangeText={text => setBody(text)}
                            />
                        </View>
                        <View style={styles.question}>
                            <Text style={styles.postModalText}>Username</Text>
                            <TextInput style={styles.input} onChangeText={text => setUsername(text)} />
                        </View>
                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={() => props.onSubmit(title, body, username)}
                        >
                            <Text>POST</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default function App() {
    let [posts, setPosts] = useState([]);
    let [users, setUsers] = useState([]);
    let [refreshing, setRefreshing] = useState(false);
    let [postModalVisible, setPostModalVisible] = useState(false);

    const getPosts = async () => {
        let result = await api.getData("posts");
        if (result.status == 200) {
            let sortedData = result.data.sort((a, b) => b.timestamp - a.timestamp);
            setPosts(sortedData);
        } else {
            console.log("Error fetching posts:", result.success);
        }
    };

    const getUsers = async () => {
        let result = await api.getData("users");
        if (result.status == 200) {
            setUsers(result.data);
        } else {
            console.log("Error fetching users:", result.success);
        }
    };

    const postNewPost = async (title, body, userName) => {
        let user = users.find(user => user.name == userName);
        let id =
            Math.max.apply(
                Math,
                posts.map(post => post.id),
            ) + 1;

        let postData = {
            title: title,
            body: body,
            userId: user ? user.name : uuid(),
            id: id,
            timestamp: moment().format("X"),
        };

        let posted = await api.postData("posts", postData);

        let newPostsArray = posts;
        newPostsArray.unshift(posted);
        setPosts(newPostsArray);
    };

    const fetchData = React.useCallback(() => {
        getUsers();
        getPosts();
        setRefreshing(false);
    }, [refreshing]);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <ScrollView
                    style={{ backgroundColor: "blue", width: "100%" }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
                >
                    {users.length > 0 ? (
                        posts.map((post, i) => {
                            let user = users.find(user => user.id == post.userId);
                            return <Post key={`post ${i}`} {...post} user={user} />;
                        })
                    ) : (
                        <ActivityIndicator size={"large"} />
                    )}
                </ScrollView>
                <TouchableOpacity style={styles.postButton} onPress={() => setPostModalVisible(true)}>
                    <Text>NEW POST</Text>
                </TouchableOpacity>
                <NewPostModal
                    visible={postModalVisible}
                    onSubmit={(title, body, username) => postNewPost(title, body, username)}
                    onClose={() => setPostModalVisible(false)}
                />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    postContainer: {
        width: "100%",
        height: 200,
        backgroundColor: "green",
        marginBottom: 25,
    },
    postTop: {
        width: "100%",
        height: "50%",
        flexDirection: "row",
        alignItems: "center",
    },
    postBottom: {
        width: "100%",
        height: "50%",
        paddingLeft: "35%",
    },
    postImageContainer: {
        height: "100%",
        width: "35%",
    },
    postButton: {
        width: 200,
        height: 100,
        backgroundColor: "red",
        position: "absolute",
        bottom: 10,
        right: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    postModal: {
        flex: 1,
        paddingHorizontal: "10%",
        paddingVertical: "20%",
        backgroundColor: "rgba(255,255,255,0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    postModalContent: {
        width: "100%",
        height: "100%",
        backgroundColor: "#333",
        alignItems: "center",
        paddingTop: "5%",
    },
    postModalText: {
        color: "#fff",
        fontWeight: "600",
        marginBottom: "5%",
    },
    question: {
        width: "80%",
    },
    input: {
        backgroundColor: "#fff",
        padding: "2%",
        margin: "2%",
        flexWrap: "wrap",
        marginBottom: "10%",
    },
    submitBtn: {
        position: "absolute",
        bottom: 30,
        width: "80%",
        height: 50,
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
    },
    postModalCloseBtn: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
