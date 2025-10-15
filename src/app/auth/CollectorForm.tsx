export default function CollectorForm() {
    return (<form>
        <div className="flex flex-col my-2">
            <label htmlFor="">Username</label>
            <input type="text" name="username" id="username" placeholder="Enter username" className="rounded-lg px-4 py-2 border-1 border-black shadow-md" />
        </div>
        <div className="flex flex-col my-2">
            <label htmlFor="">Password</label>
            <input type="password" name="password" id="password" placeholder="Enter password" className="rounded-lg px-4 py-2 border-1 border-black shadow-md" />
        </div>
        <div className="flex justify-center mt-6">
            <button type="submit" className="px-12 py-3 bg-red-800 rounded-full text-white">Sign Up</button>
        </div>
    </form>);
}