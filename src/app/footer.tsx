export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 bottom-0 w-full fixed z-50">
    <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
      <div className="flex justify-center space-x-6 md:order-2">
        <a href="https://www.kiyac.app/privacypolicy/jybym3MhlgpabWuMGpTp" target="_blank" className="text-gray-400 hover:text-gray-500">
          プライバシーポリシー
        </a>
        <a href="https://www.kiyac.app/termsOfService/k0lWKb38cqY2BmWcyjuG" target="_blank" className="text-gray-400 hover:text-gray-500">
          利用規約
        </a>
      </div>
      <div className="mmd:mt-0 md:order-1">
        <p className="text-center text-sm text-gray-400">&copy; 2024 Mai Sato</p>
        <p className="text-center text-sm text-gray-400">※作成にはAIを使用しているので文章がおかしい場合がございますがご了承くださいますようお願いします。</p>
      </div>
    </div>
  </footer>
  );
}