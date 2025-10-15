export default function ArtistForm(){
    return (<form>
        <div className="flex flex-col my-2">
            <label htmlFor="">Username</label>
            <input type="text" name="" id="" placeholder="Enter username" className="rounded-lg px-4 py-2 border-1 border-black shadow-md" />
        </div>
        <div className="flex flex-col my-2">
            <label htmlFor="">Password</label>
            <input type="password" name="" id="" placeholder="Enter password" className="rounded-lg px-4 py-2 border-1 border-black shadow-md" />
        </div>
        <div className="mt-6 justify-center flex">
            <button type="submit" className="bg-red-900 text-white py-3 px-12 rounded-full">Sign Up</button>
        </div>
    </form>);
}