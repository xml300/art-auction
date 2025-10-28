export default function NotificationSettings() {
    return (
        <div className="p-12 w-full">
            <div className="mb-12">
                <h2 className="font-semibold text-2xl dark:text-white">Email Notifications</h2>
                <div className="space-y-2 text-lg mt-4">
                    <div className="flex items-center">
                        <input type="checkbox" name="weekly_newsletters" id="weekly_newsletters" className="w-6 h-6" />
                        <label htmlFor="weekly_newsletters" className="ml-2 dark:text-white">Weekly Newsletters</label>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" name="new_artworks_notifications" id="new_artworks_notifications" className="w-6 h-6" />
                        <label htmlFor="new_artworks_notifications" className="ml-2 dark:text-white">New Artworks from Artists You Bid On</label>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="font-semibold text-2xl dark:text-white">Push Notifications</h2>
                <div className="space-y-2 text-lg mt-4">
                    <div className="flex items-center">
                        <input type="checkbox" name="enable_web_notifications" id="enable_web_notifications" className="w-6 h-6" />
                        <label htmlFor="enable_web_notifications" className="ml-2 dark:text-white">Enable Web Notifications</label>
                    </div>
                </div>
            </div>
            <button type="submit" className="bg-black text-white rounded-lg px-6 py-2 mt-8">Save Changes</button>
        </div>
    );
}
