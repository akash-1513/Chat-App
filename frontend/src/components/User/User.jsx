import { useEffect, useState } from "react"
import { useLoaderData, useParams } from "react-router-dom"

export default function User() {

    const data = useLoaderData()
    
    return (
        <>
            <h3>Followers: {data?.followers}</h3>
            <img src = {data?.avatar_url} width = "300px" height="300px"></img>
        </>
    )
}

export const githubInfoLoader = async() => {
    const response = await fetch('https://api.github.com/users/hiteshchoudhary');
    const data = await response.json();

    return data;
}